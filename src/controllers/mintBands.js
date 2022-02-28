import { Keypair, PublicKey } from "@solana/web3.js";
import { actions } from "@metaplex/js";
const { mintNFT } = actions;

export const mint = async (connection, wallet, passes, metadataUrl, tokens) => {
  // make keypair to sign transactions
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(process.env.REACT_APP_KEY.split(",").map(Number))
  );

  // mint band nfts, stake band members and burn band pass
  return await mintNFT({
    connection,
    wallet,
    uri: metadataUrl,
    maxSupply: 0,
    keypair,
    passToken: new PublicKey(passes[0].token),
    passMint: new PublicKey(passes[0].mint),
    tokens,
  });
};
