import { useCallback, useEffect, useState } from "react";
import { CHAIN_ID } from "./theme";

/* Injected-provider wallet layer (MetaMask, Rabby, Coinbase Wallet,
   in-wallet browsers). No extra dependencies. If you later want the
   WalletConnect QR flow, replace this file with wagmi — the rest of the
   app only depends on the shape useWallet() returns. */

type Eth = {
  request: (a: { method: string; params?: unknown[] }) => Promise<any>;
  on?: (e: string, cb: (...a: any[]) => void) => void;
  removeListener?: (e: string, cb: (...a: any[]) => void) => void;
};

const eth = (): Eth | null =>
  typeof window !== "undefined" ? ((window as any).ethereum ?? null) : null;

export const shorten = (a: string, lead = 6, tail = 4) =>
  a ? `${a.slice(0, lead)}…${a.slice(-tail)}` : "";

export const isValidEvm = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a.trim());

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const hasWallet = !!eth();

  useEffect(() => {
    const p = eth();
    if (!p) return;
    p.request({ method: "eth_accounts" })
      .then((a: string[]) => a?.[0] && setAddress(a[0].toLowerCase()))
      .catch(() => {});
    p.request({ method: "eth_chainId" })
      .then((id: string) => setChainId(parseInt(id, 16)))
      .catch(() => {});

    const onAcc = (a: string[]) => setAddress(a?.[0]?.toLowerCase() ?? null);
    const onChain = (id: string) => setChainId(parseInt(id, 16));
    p.on?.("accountsChanged", onAcc);
    p.on?.("chainChanged", onChain);
    return () => {
      p.removeListener?.("accountsChanged", onAcc);
      p.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const connect = useCallback(async () => {
    const p = eth();
    if (!p) {
      setError("No wallet found. Install MetaMask, or open this page in your wallet's browser.");
      return;
    }
    setError("");
    setConnecting(true);
    try {
      const a: string[] = await p.request({ method: "eth_requestAccounts" });
      setAddress(a?.[0]?.toLowerCase() ?? null);
      const id: string = await p.request({ method: "eth_chainId" });
      setChainId(parseInt(id, 16));
    } catch (e: any) {
      setError(e?.code === 4001 ? "Connection cancelled." : "Could not connect. Try again.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const switchToMainnet = useCallback(async () => {
    const p = eth();
    if (!p) return;
    try {
      await p.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + CHAIN_ID.toString(16) }],
      });
    } catch {
      setError("Switch your wallet to Ethereum mainnet to continue.");
    }
  }, []);

  const disconnect = useCallback(() => { setAddress(null); setError(""); }, []);

  return {
    address, chainId, connect, disconnect, switchToMainnet,
    connecting, error, hasWallet,
    wrongNetwork: address !== null && chainId !== null && chainId !== CHAIN_ID,
  };
}
