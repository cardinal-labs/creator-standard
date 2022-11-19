/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { ApproveIx, approveIxBeet } from '../types/ApproveIx'

/**
 * @category Instructions
 * @category Approve
 * @category generated
 */
export type ApproveInstructionArgs = {
  approveIx: ApproveIx
}
/**
 * @category Instructions
 * @category Approve
 * @category generated
 */
export const ApproveStruct = new beet.BeetArgsStruct<
  ApproveInstructionArgs & {
    instructionDiscriminator: number
  }
>(
  [
    ['instructionDiscriminator', beet.u8],
    ['approveIx', approveIxBeet],
  ],
  'ApproveInstructionArgs'
)
/**
 * Accounts required by the _Approve_ instruction
 *
 * @property [] mintManager
 * @property [] ruleset
 * @property [] mint
 * @property [_writable_] holderTokenAccount
 * @property [**signer**] holder
 * @property [] delegate
 * @category Instructions
 * @category Approve
 * @category generated
 */
export type ApproveInstructionAccounts = {
  mintManager: web3.PublicKey
  ruleset: web3.PublicKey
  mint: web3.PublicKey
  holderTokenAccount: web3.PublicKey
  holder: web3.PublicKey
  delegate: web3.PublicKey
  tokenProgram?: web3.PublicKey
}

export const approveInstructionDiscriminator = 7

/**
 * Creates a _Approve_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Approve
 * @category generated
 */
export function createApproveInstruction(
  accounts: ApproveInstructionAccounts,
  args: ApproveInstructionArgs,
  programId = new web3.PublicKey('creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez')
) {
  const [data] = ApproveStruct.serialize({
    instructionDiscriminator: approveInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.mintManager,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.ruleset,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.holderTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.holder,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.delegate,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
