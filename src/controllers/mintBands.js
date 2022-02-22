import { Keypair, PublicKey } from "@solana/web3.js";
import { actions } from "@metaplex/js";
const { mintNFT, sendToken } = actions;

export const stake = async (connection, wallet, tokens) => {
  // make keypair to sign transactions
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(process.env.REACT_APP_KEY.split(",").map(Number))
  );
  // stake band members
  return await sendToken({
    connection,
    wallet,
    keypair,
    tokens,
  });
};

export const mint = async (connection, wallet, passes, metadataUrl) => {
  // make keypair to sign transactions
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(process.env.REACT_APP_KEY.split(",").map(Number))
  );

  return await mintNFT({
    connection,
    wallet,
    uri: metadataUrl,
    maxSupply: 1,
    keypair,
    passToken: new PublicKey(passes[0].token),
    passMint: new PublicKey(passes[0].mint),
  });
};
