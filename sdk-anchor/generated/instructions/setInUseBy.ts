/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { SetInUseByIx, setInUseByIxBeet } from '../types/SetInUseByIx'

/**
 * @category Instructions
 * @category SetInUseBy
 * @category generated
 */
export type SetInUseByInstructionArgs = {
  ix: SetInUseByIx
}
/**
 * @category Instructions
 * @category SetInUseBy
 * @category generated
 */
export const setInUseByStruct = new beet.BeetArgsStruct<
  SetInUseByInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['ix', setInUseByIxBeet],
  ],
  'SetInUseByInstructionArgs'
)
/**
 * Accounts required by the _setInUseBy_ instruction
 *
 * @property [_writable_] mintManager
 * @property [**signer**] holder
 * @property [] holderTokenAccount
 * @category Instructions
 * @category SetInUseBy
 * @category generated
 */
export type SetInUseByInstructionAccounts = {
  mintManager: web3.PublicKey
  holder: web3.PublicKey
  holderTokenAccount: web3.PublicKey
}

export const setInUseByInstructionDiscriminator = [
  26, 9, 136, 91, 41, 155, 85, 39,
]

/**
 * Creates a _SetInUseBy_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category SetInUseBy
 * @category generated
 */
export function createSetInUseByInstruction(
  accounts: SetInUseByInstructionAccounts,
  args: SetInUseByInstructionArgs,
  programId = new web3.PublicKey('creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez')
) {
  const [data] = setInUseByStruct.serialize({
    instructionDiscriminator: setInUseByInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.mintManager,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.holder,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.holderTokenAccount,
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
