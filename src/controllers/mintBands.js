import { Keypair, PublicKey } from "@solana/web3.js";
import { actions } from "@metaplex/js";
const { mintNFT, updateMetadata } = actions;
// vars
const mint = async (connection, wallet) => {
  console.log(process.env.REACT_APP_KEY);
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(process.env.REACT_APP_KEY.split(",").map(Number))
  );

  await mintNFT({
    connection,
    wallet,
    uri: "https://ipfs.io/ipfs/bafkreidmbmiehdu5f4ia7atskie7ih6cvgglxb2vhread2kupn6x3edov4",
    maxSupply: 1,
    keypair,
  });
};

/*
.then((res) =>
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
 */
export default mint;
