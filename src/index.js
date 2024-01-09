import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/css/style.css";

import { staticConfig } from "./components/static";

const WalletTheme = {
  colors: {
    // modalBackground: 'linear-gradient(to right, #0d0212, #2d224a, #0d0212)',
    // modalBackground: 'linear-gradient(to right, #4250b5, #8b2eb0, #e15897)',
    modalBackground: 'linear-gradient(to right, #1e1532, #2d224a, #1e1532)',
    modalText: 'white'
  },
}

const WalletAvatar = () => {
  return <img
    src={global.CHIBA_TOKEN.logo}
    alt="avatar"
    width={128}
    height={128}
    style={{ borderRadius: 999 }}
  />;
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    global.chain,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: staticConfig.PROJECT,
  projectId: staticConfig.PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} avatar={WalletAvatar} theme={WalletTheme}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
