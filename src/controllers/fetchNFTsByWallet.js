// Courtesy of mmdhrumil#9327 on discord
// (and davidpullinger) :)
import { TokenAccount } from "@metaplex-foundation/mpl-core/";
import { MetadataData } from "@metaplex-foundation/mpl-token-metadata/";
import { PublicKey } from "@solana/web3.js";

export const fetchNFTsOwnedByWallet = async (userWallet, connection) => {
  // get users token accounts
  const accounts = await TokenAccount.getTokenAccountsByOwner(
    connection,
    userWallet
  );
  const accountsWithAmount = accounts
    .map(({ data }) => data)
    .filter(({ amount }) => amount?.toNumber() > 0);

  // get mint addr and use it to get metadata address
  let nftMintAddresses = accountsWithAmount.map(({ mint }) => mint);
  let nftMetadataAddresses = [];
  for (const addr of nftMintAddresses) {
    nftMetadataAddresses.push(await fetchMetadataAccountForNFT(addr));
  }
  // get acc info
  let nftAcInfo;
  nftAcInfo = await connection.getMultipleAccountsInfo(
    nftMetadataAddresses,
    "processed"
  );
  // deserialize data
  let nftAcInfoDeserialized = nftAcInfo
    ?.map((info) =>
      info?.data !== undefined
        ? MetadataData.deserialize(info?.data)
        : undefined
    )
    .filter(function (element) {
      return element !== undefined;
    });

  return nftAcInfoDeserialized;
};

export async function fetchMetadataAccountForNFT(nftMintKey) {
  const metadataBuffer = Buffer.from("metadata");
  const metadataProgramIdPublicKey = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const metadataAccount = (
    await PublicKey.findProgramAddress(
      [
        metadataBuffer,
        metadataProgramIdPublicKey.toBuffer(),
        nftMintKey.toBuffer(),
      ],
      metadataProgramIdPublicKey
    )
  )[0];

  return metadataAccount;
}
