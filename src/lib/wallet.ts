import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

/* Thin shim over wagmi + RainbowKit that keeps the exact shape the rest
   of the app already expects (Layout's ConnectButton, Whitelist.tsx),
   so swapping the underlying wallet stack didn't require touching them.

   RainbowKit's modal handles wallet discovery itself — MetaMask, Coinbase
   Wallet, WalletConnect's QR flow for mobile, and more — so there's no
   more "no wallet found" branch to handle manually. */

export const shorten = (a: string, lead = 6, tail = 4) =>
  a ? `${a.slice(0, lead)}…${a.slice(-tail)}` : "";

export const isValidEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a.trim());

export function useWallet() {
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { openConnectModal, connectModalOpen } = useConnectModal();

  return {
    address: address ? address.toLowerCase() : null,
    chainId: chainId ?? null,
    connect: () => openConnectModal?.(),
    disconnect: () => disconnect(),
    switchToMainnet: () => switchChain?.({ chainId: mainnet.id }),
    connecting: connectModalOpen || switching,
    error: "",
    hasWallet: true,
    wrongNetwork: isConnected && chainId !== undefined && chainId !== mainnet.id,
  };
}

