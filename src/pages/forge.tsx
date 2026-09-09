import Layout, { Section, Ember } from "@/components/Layout";
import Embers from "@/components/Embers";
import { useWallet, shorten } from "@/lib/wallet";
import { C, display, CONTRACT, X_URL } from "@/lib/theme";

/* No holdings check yet — connecting is the whole gate for now.
   Once the Furnace balanceOf / ERC-6551 read is ready, that logic
   slots in below the wrongNetwork branch, before the "being built"
   placeholder is reached. */
export default function Forge() {
  const { address, connect, connecting, wrongNetwork, switchToMainnet } = useWallet();

  return (
    <Layout>
      <section style={{
        position: "relative", minHeight: "calc(100vh - 66px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 20px", overflow: "hidden", textAlign: "center",
      }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 42%, ${C.ember}16 0%, transparent 62%)`,
        }} />
        <Embers density={20} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560 }}>
          {!address ? (
            <>
              <p style={{
                fontFamily: display, fontWeight: 700, fontSize: "0.72rem",
                letterSpacing: "0.32em", color: C.ember, margin: "0 0 16px",
              }}>
                LOCKED
              </p>
              <h1 style={{
                fontFamily: display, fontWeight: 700, fontSize: "clamp(2.2rem,9vw,3.6rem)",
                lineHeight: 1.05, color: C.cream, margin: "0 0 20px", letterSpacing: "0.02em",
              }}>
                THE FORGE
              </h1>
              <p style={{ fontSize: "1.02rem", lineHeight: 1.8, color: C.muted, margin: "0 auto 32px", maxWidth: "42ch" }}>
                Connect the wallet holding your Furnace to step inside. Nothing moves
                and nothing costs gas just to look.
              </p>
              <Ember onClick={connect}>{connecting ? "CONNECTING…" : "CONNECT WALLET"}</Ember>
            </>
          ) : wrongNetwork ? (
            <>
              <h1 style={{
                fontFamily: display, fontWeight: 700, fontSize: "clamp(2.2rem,9vw,3.6rem)",
                lineHeight: 1.05, color: C.cream, margin: "0 0 20px", letterSpacing: "0.02em",
              }}>
                THE FORGE
              </h1>
              <p style={{ fontSize: "1.02rem", lineHeight: 1.8, color: C.muted, margin: "0 auto 32px", maxWidth: "42ch" }}>
                The Furnace lives on Ethereum mainnet. Switch networks to continue.
              </p>
              <Ember onClick={switchToMainnet} tone="ghost">SWITCH TO ETHEREUM</Ember>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: display, fontWeight: 700, fontSize: "0.7rem",
                letterSpacing: "0.28em", color: C.flame, margin: "0 0 16px",
              }}>
                CONNECTED AS {shorten(address, 6, 4).toUpperCase()}
              </p>
              <h1 style={{
                fontFamily: display, fontWeight: 700, fontSize: "clamp(2.2rem,9vw,3.6rem)",
                lineHeight: 1.05, color: C.cream, margin: "0 0 20px", letterSpacing: "0.02em",
              }}>
                THE FORGE IS<br />BEING BUILT
              </h1>
              <p style={{ fontSize: "1.02rem", lineHeight: 1.8, color: C.muted, margin: "0 auto 28px", maxWidth: "44ch" }}>
                This is where you'll activate your Furnace's own wallet, watch its stocks
                grow, and decide when to withdraw or hold. Your wallet is connected and
                ready — the Forge itself isn't lit yet.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 30 }}>
                <Ember href={X_URL} tone="ghost">FOLLOW FOR UPDATES</Ember>
              </div>
              <p style={{ fontSize: "0.78rem", color: C.faint, margin: 0, wordBreak: "break-all" }}>
                Reading Furnace NFT {CONTRACT}
              </p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
