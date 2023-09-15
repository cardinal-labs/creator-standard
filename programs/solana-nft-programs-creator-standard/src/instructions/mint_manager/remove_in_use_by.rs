use crate::state::CreatorStandardAccount;
use crate::state::MintManager;
use crate::utils::assert_address;
use crate::utils::assert_mut;
use crate::utils::assert_signer;
use crate::CreatorStandardInstruction;
use borsh::BorshSerialize;
use solana_program::account_info::next_account_info;
use solana_program::account_info::AccountInfo;
use solana_program::entrypoint::ProgramResult;
use solana_program::instruction::AccountMeta;
use solana_program::instruction::Instruction;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;

#[allow(clippy::too_many_arguments)]
pub fn remove_in_use_by(
    program_id: Pubkey,
    mint_manager: Pubkey,
    user: Pubkey,
) -> Result<Instruction, ProgramError> {
    Ok(Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(mint_manager, false),
            AccountMeta::new_readonly(user, true),
        ],
        data: CreatorStandardInstruction::RemoveInUseBy.try_to_vec()?,
    })
}

pub struct RemoveInUseByCtx<'a, 'info> {
    pub mint_manager: &'a AccountInfo<'info>,
    pub user: &'a AccountInfo<'info>,
}

impl<'a, 'info> RemoveInUseByCtx<'a, 'info> {
    pub fn load(accounts: &'a [AccountInfo<'info>]) -> Result<Self, ProgramError> {
        let account_iter = &mut accounts.iter();
        let ctx = Self {
            mint_manager: next_account_info(account_iter)?,
            user: next_account_info(account_iter)?,
        };
        // deserializations
        let mint_manager: MintManager = MintManager::from_account_info(ctx.mint_manager)?;

        // mint_manager
        assert_mut(ctx.mint_manager, "mint_manager")?;

        // user
        assert_address(
            &mint_manager.in_use_by.expect("Token not in use"),
            ctx.user.key,
            "user",
        )?;
        assert_signer(ctx.user, "user")?;

        Ok(ctx)
    }
}

pub fn handler(ctx: RemoveInUseByCtx) -> ProgramResult {
    let mut mint_manager: MintManager = MintManager::from_account_info(ctx.mint_manager)?;
    mint_manager.in_use_by = None;
    mint_manager.save(ctx.mint_manager)?;

    Ok(())
}
