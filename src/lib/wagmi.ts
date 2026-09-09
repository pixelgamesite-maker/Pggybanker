import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

/* WalletConnect requires a free project ID from https://cloud.reown.com
   (formerly WalletConnect Cloud). Without it, MetaMask/Coinbase Wallet
   still connect fine, but the WalletConnect QR option in the modal
   won't work — so mobile wallet-app users lose their main path in. */
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "";

if (!projectId && import.meta.env.DEV) {
  console.warn(
    "[wagmi] VITE_WALLETCONNECT_PROJECT_ID is not set. Get one free at https://cloud.reown.com — " +
    "MetaMask and Coinbase Wallet will still work, but WalletConnect (mobile QR) won't."
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "The Furnace",
  projectId,
  chains: [mainnet],
  ssr: false,
});
