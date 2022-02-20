import { Keypair, PublicKey } from "@solana/web3.js";
import { actions } from "@metaplex/js";
const { mintNFT } = actions;

const mint = async (connection, wallet, passes, metadata) => {
  // check if user is eligible for mint
  if (passes.length === 0) {
    console.log("%cYou do not have a band pass.", "color: red;");
    return;
  }

  // make videos using nft data
  // TODO

  // make keypair to sign transactions
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(process.env.REACT_APP_KEY.split(",").map(Number))
  );
  console.log(passes[0].token);
  // burn band pass and mint band nft
  await mintNFT({
    connection,
    wallet,
    uri: "https://ipfs.io/ipfs/bafkreidmbmiehdu5f4ia7atskie7ih6cvgglxb2vhread2kupn6x3edov4",
    maxSupply: 1,
    keypair,
    passToken: new PublicKey(passes[0].token),
    passMint: new PublicKey(passes[0].mint),
  })
    .then((res) => {
      console.log(
        `%cYour NFT has been minted!\nView it at:%c https://solscan.io/token/${res.mint}?cluster=devnet`,
        "color: green;",
        "font-weight:bold"
      );
    })
    .catch((err) => {
      console.log(
        `%cPlease take note of the following error: ${err}`,
        "color: red;"
      );
    });
};

export default mint;
