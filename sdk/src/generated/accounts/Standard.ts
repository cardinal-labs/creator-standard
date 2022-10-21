/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link Standard}
 * @category Accounts
 * @category generated
 */
export type StandardArgs = {
  bump: number
  version: number
  authority: web3.PublicKey
  checkSellerFeeBasisPoints: boolean
  name: string
  disallowedPrograms: web3.PublicKey[]
  allowedPrograms: web3.PublicKey[]
}

export const standardDiscriminator = [183, 73, 235, 183, 240, 4, 194, 116]
/**
 * Holds the data for the {@link Standard} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Standard implements StandardArgs {
  private constructor(
    readonly bump: number,
    readonly version: number,
    readonly authority: web3.PublicKey,
    readonly checkSellerFeeBasisPoints: boolean,
    readonly name: string,
    readonly disallowedPrograms: web3.PublicKey[],
    readonly allowedPrograms: web3.PublicKey[]
  ) {}

  /**
   * Creates a {@link Standard} instance from the provided args.
   */
  static fromArgs(args: StandardArgs) {
    return new Standard(
      args.bump,
      args.version,
      args.authority,
      args.checkSellerFeeBasisPoints,
      args.name,
      args.disallowedPrograms,
      args.allowedPrograms
    )
  }

  /**
   * Deserializes the {@link Standard} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Standard, number] {
    return Standard.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Standard} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey
  ): Promise<Standard> {
    const accountInfo = await connection.getAccountInfo(address)
    if (accountInfo == null) {
      throw new Error(`Unable to find Standard account at ${address}`)
    }
    return Standard.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'creatS3mfzrTGjwuLD1Pa2HXJ1gmq6WXb4ssnwUbJez'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, standardBeet)
  }

  /**
   * Deserializes the {@link Standard} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Standard, number] {
    return standardBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Standard} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return standardBeet.serialize({
      accountDiscriminator: standardDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Standard} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: StandardArgs) {
    const instance = Standard.fromArgs(args)
    return standardBeet.toFixedFromValue({
      accountDiscriminator: standardDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Standard} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: StandardArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Standard.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link Standard} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      version: this.version,
      authority: this.authority.toBase58(),
      checkSellerFeeBasisPoints: this.checkSellerFeeBasisPoints,
      name: this.name,
      disallowedPrograms: this.disallowedPrograms,
      allowedPrograms: this.allowedPrograms,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const standardBeet = new beet.FixableBeetStruct<
  Standard,
  StandardArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['version', beet.u8],
    ['authority', beetSolana.publicKey],
    ['checkSellerFeeBasisPoints', beet.bool],
    ['name', beet.utf8String],
    ['disallowedPrograms', beet.array(beetSolana.publicKey)],
    ['allowedPrograms', beet.array(beetSolana.publicKey)],
  ],
  Standard.fromArgs,
  'Standard'
)
