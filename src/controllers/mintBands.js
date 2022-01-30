import { PublicKey } from "@solana/web3.js";
import { actions } from "@metaplex/js";
const { mintNFT, updateMetadata } = actions;
// vars

const mint = async (connection, userWallet) => {
  await mintNFT({
    connection: connection,
    wallet: userWallet,
    uri: "https://bafkreibfslhdqknd32tvtmn4o2hnxzurzeti356yeyhtmv2tt3omdqntfu.ipfs.dweb.link/",
    maxSupply: 1,
  }).then((res) =>
    updateMetadata({
      connection: connection,
      wallet: userWallet,
      editionMint: res.mint,
      newUpdateAuthority: new PublicKey(
        "9kv7dpjENe8C5Et8N8HduM63z7PS4erbCyy25PCp8G4w"
      ),
      primarySaleHappened: true,
    })
  );
};

/*
 */
export default mint;
