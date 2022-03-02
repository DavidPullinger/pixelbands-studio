// Courtesy of mmdhrumil#9327 on discord
// (and davidpullinger) :)
import { TokenAccount } from "@metaplex-foundation/mpl-core/";
import { MetadataData } from "@metaplex-foundation/mpl-token-metadata/";
import { PublicKey } from "@solana/web3.js";
import MemberHashList from "./MemberHashList.json";
import BandPassHashList from "./BandPassHashList.json";

export const fetchNFTsOwnedByWallet = async (userWallet, connection) => {
  // get users token accounts
  const accounts = await TokenAccount.getTokenAccountsByOwner(
    connection,
    userWallet
  );

  const temp = accounts.filter(
    ({ data }) =>
      data?.amount?.toNumber() > 0 &&
      (MemberHashList.includes(data?.mint?.toBase58()) ||
        BandPassHashList.includes(data?.mint?.toBase58()))
  );
  accountsWithAmount = temp.map(({ data }) => data);
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
  for (let i = 0; i < nftAcInfoDeserialized.length; i++) {
    nftAcInfoDeserialized[i].mintATA = temp[i].pubkey.toString(); // heres the fix if you're looking for it :)
  }
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
