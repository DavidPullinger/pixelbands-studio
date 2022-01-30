import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { WalletConnectionProvider } from "./controllers/WalletConnectionProvider";

function App() {
  return (
    <WalletConnectionProvider network={"mainnet-beta"}>
      <WalletModalProvider featuredWallets={2} logo={logo}>
        <div>
          <div className="App">
            <Navigation />
            <div className="mid-wrapper">
              <BottomLeft />
              <NFTContainer />
              <BottomRight />
            </div>
          </div>
        </div>
      </WalletModalProvider>
    </WalletConnectionProvider>
  );
}

export default App;
