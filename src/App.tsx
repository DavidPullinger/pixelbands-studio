import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { FC, ReactNode, useEffect, useMemo } from "react";
// component imports
const NFTContainer = require("./components/NFTContainer/NFTContainer.js");
const VolumeSlider = require("./components/VolumeSlider/VolumeSlider.js");
/// top left
import light_button from "./assets/top-left/light-button.png";
import offlight_button from "./assets/top-left/offlight-button.png";
import light from "./assets/top-left/light.png";
import rect from "./assets/top-left/rect.png";
import oval from "./assets/top-left/oval.png";
import square from "./assets/top-left/square.png";
import long_rect from "./assets/top-left/long-rect.png";
/// top right
import horizontal_slider from "./assets/top-right/horizontal-slider.png";
import squares from "./assets/top-right/squares.png";
/// bottom right
import dots from "./assets/bottom-right/dots-4.png";
import logo from "./assets/logo.png";
// style imports
import "./App.css";

export const App: FC = () => {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return isMobile ? (
    <div className="mobile-wrapper">
      <img className="mobile-logo" src={logo} alt="logo" />
      <h1 className="mobile-header">Mobile site coming soon!</h1>
    </div>
  ) : (
    <Context>
      <Content />
    </Context>
  );
};

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  return (
    <div>
      <div className="App">
        <Navigation />
        <div className="mid-wrapper">
          <div className="left">
            <BottomLeft />
          </div>
          <NFTContainer />
          <BottomRight />
        </div>
      </div>
    </div>
  );
};

function Navigation() {
  return (
    <nav className="nav">
      <TopLeft />
      <h1 className="header">Studio</h1>
      <div className="top-right-wrapper">
        <TopRight />
        <WalletMultiButton />
      </div>
    </nav>
  );
}

function TopLeft() {
  return (
    <div className="decor-top-left">
      <div className="first">
        <img src={long_rect} alt="decor" />
        <img style={{ width: "50%" }} src={rect} alt="decor" />
      </div>
      <div className="second">
        <img src={oval} alt="decor" />
        <img src={square} alt="decor" />
      </div>
      <div className="third">
        <img src={light} alt="decor" />
      </div>
      <div className="fourth">
        <img src={light_button} alt="decor" />
        <img src={offlight_button} alt="decor" />
        <img src={light_button} alt="decor" />
        <img src={light_button} alt="decor" />
      </div>
    </div>
  );
}

function TopRight() {
  return (
    <div className="decor-top-right">
      <img src={horizontal_slider} alt="slider" />
      <img src={squares} alt="squares" />
    </div>
  );
}

function BottomLeft() {
  return (
    <div>
      <h2>Volume</h2>
      <div className="decor-bottom-left">
        <VolumeSlider role="Drums" id="drummer-volume" />
        <VolumeSlider role="Guitar" id="guitar-volume" />
        <VolumeSlider role="Bass" id="bass-volume" />
        <VolumeSlider role="Keyboard" id="keys-volume" />
      </div>
    </div>
  );
}

function BottomRight() {
  return (
    <div className="decor-bottom-right">
      <img className="dots" src={dots} alt="dots" />
      <a href="https://www.pixelbands.io" target="_blank" rel="noreferrer">
        <img className="logo" src={logo} alt="logo" />
      </a>
    </div>
  );
}
