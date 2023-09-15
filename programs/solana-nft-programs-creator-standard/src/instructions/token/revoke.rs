use crate::errors::ErrorCode;
use crate::state::assert_mint_manager_seeds;
use crate::state::CreatorStandardAccount;
use crate::state::MintManager;
use crate::utils::assert_address;
use crate::utils::assert_amount;
use crate::utils::assert_mut;
use crate::utils::assert_signer;
use crate::utils::assert_with_msg;
use crate::utils::unpack_checked_token_account;
use crate::CreatorStandardInstruction;
use borsh::BorshSerialize;
use lazy_format::lazy_format;
use solana_program::account_info::next_account_info;
use solana_program::account_info::AccountInfo;
use solana_program::entrypoint::ProgramResult;
use solana_program::instruction::AccountMeta;
use solana_program::instruction::Instruction;
use solana_program::program::invoke_signed;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;

#[allow(clippy::too_many_arguments)]
pub fn revoke(
    program_id: Pubkey,
    mint_manager: Pubkey,
    mint: Pubkey,
    holder_token_account: Pubkey,
    holder: Pubkey,
) -> Result<Instruction, ProgramError> {
    Ok(Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new_readonly(mint_manager, false),
            AccountMeta::new_readonly(mint, false),
            AccountMeta::new(holder_token_account, false),
            AccountMeta::new_readonly(holder, true),
            AccountMeta::new_readonly(spl_token::id(), false),
        ],
        data: CreatorStandardInstruction::Revoke.try_to_vec()?,
    })
}

pub struct RevokeCtx<'a, 'info> {
    pub mint_manager: &'a AccountInfo<'info>,
    pub mint: &'a AccountInfo<'info>,
    pub holder_token_account: &'a AccountInfo<'info>,
    pub holder: &'a AccountInfo<'info>,
    pub token_program: &'a AccountInfo<'info>,
}

impl<'a, 'info> RevokeCtx<'a, 'info> {
    pub fn load(accounts: &'a [AccountInfo<'info>]) -> Result<Self, ProgramError> {
        let account_iter = &mut accounts.iter();
        let ctx = Self {
            mint_manager: next_account_info(account_iter)?,
            mint: next_account_info(account_iter)?,
            holder_token_account: next_account_info(account_iter)?,
            holder: next_account_info(account_iter)?,
            token_program: next_account_info(account_iter)?,
        };
        // deserializations
        let mint_manager: MintManager = MintManager::from_account_info(ctx.mint_manager)?;
        let holder_token_account =
            unpack_checked_token_account(ctx.holder_token_account, Some("holder_token_account"))?;

        // mint_manager
        assert_address(&mint_manager.mint, ctx.mint.key, "mint_manager mint")?;

        ///// no checks for mint /////

        // holder_token_account
        assert_mut(ctx.holder_token_account, "holder_token_account")?;
        assert_amount(
            &holder_token_account.amount.to_string(),
            "1",
            "holder_token_account",
        )?;
        assert_address(
            &holder_token_account.mint,
            ctx.mint.key,
            "holder_token_account mint",
        )?;
        assert_address(
            &holder_token_account.owner,
            ctx.holder.key,
            "holder_token_account owner",
        )?;
        assert_with_msg(
            holder_token_account.delegate.is_some(),
            ProgramError::InvalidInstructionData,
            lazy_format!("{} must not be none", "holder_token_account"),
        )?;

        // holder
        assert_signer(ctx.holder, "holder")?;

        // token_program
        assert_address(ctx.token_program.key, &spl_token::id(), "token_program")?;

        Ok(ctx)
    }
}

pub fn handler(ctx: RevokeCtx) -> ProgramResult {
    let mint_manager: MintManager = MintManager::from_account_info(ctx.mint_manager)?;
    if mint_manager.in_use_by.is_some() {
        return Err(ProgramError::from(ErrorCode::TokenCurentlyInUse));
    }
    let mint_manager_seeds = assert_mint_manager_seeds(ctx.mint.key, ctx.mint_manager.key)?;

    // thaw account
    invoke_signed(
        &spl_token::instruction::thaw_account(
            ctx.token_program.key,
            ctx.holder_token_account.key,
            ctx.mint.key,
            ctx.mint_manager.key,
            &[],
        )?,
        &[
            ctx.holder_token_account.clone(),
            ctx.mint.clone(),
            ctx.mint_manager.clone(),
        ],
        &[&mint_manager_seeds
            .iter()
            .map(|s| s.as_slice())
            .collect::<Vec<&[u8]>>()],
    )?;

    // revoke
    invoke_signed(
        &spl_token::instruction::revoke(
            ctx.token_program.key,
            ctx.holder_token_account.key,
            ctx.holder.key,
            &[],
        )?,
        &[ctx.holder_token_account.clone(), ctx.holder.clone()],
        &[&mint_manager_seeds
            .iter()
            .map(|s| s.as_slice())
            .collect::<Vec<&[u8]>>()],
    )?;

    // freeze account
    invoke_signed(
        &spl_token::instruction::freeze_account(
            ctx.token_program.key,
            ctx.holder_token_account.key,
            ctx.mint.key,
            ctx.mint_manager.key,
            &[],
        )?,
        &[
            ctx.holder_token_account.clone(),
            ctx.mint.clone(),
            ctx.mint_manager.clone(),
        ],
        &[&mint_manager_seeds
            .iter()
            .map(|s| s.as_slice())
            .collect::<Vec<&[u8]>>()],
    )?;

    Ok(())
}
