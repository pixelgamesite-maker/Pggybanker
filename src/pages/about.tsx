import { useState } from "react";
import Layout, { Section, Seam, Heading, Ember } from "@/components/Layout";
import Whitelist from "@/components/Whitelist";
import { C, display, FURNACE } from "@/lib/theme";

const P: React.CSSProperties = {
  fontSize: "1.02rem", lineHeight: 1.85, color: C.muted,
  margin: "0 0 16px", maxWidth: "60ch",
};

function Steps({ items }: { items: string[] }) {
  return (
    <ol style={{ listStyle: "none", margin: "0 0 8px", padding: 0, counterReset: "s" }}>
      {items.map((text, i) => (
        <li key={i} style={{ display: "flex", gap: 16, padding: "13px 0", borderBottom: `1px solid ${C.line}` }}>
          <span style={{
            fontFamily: display, fontWeight: 700, fontSize: "0.72rem", color: C.ember,
            flexShrink: 0, paddingTop: 4, minWidth: 22,
          }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: "1rem", lineHeight: 1.75, color: C.cream, opacity: 0.85, maxWidth: "56ch" }}>
            {text}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function About() {
  const [wl, setWl] = useState(false);

  return (
    <Layout>
      <Whitelist open={wl} onClose={() => setWl(false)} />

      <Section>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 26 }}>
          <img src={FURNACE} alt="" style={{
            width: 88, height: "auto", filter: `drop-shadow(0 0 20px ${C.ember}77)`, flexShrink: 0,
          }} />
          <h1 style={{
            fontFamily: display, fontWeight: 700, fontSize: "clamp(1.9rem,7vw,3.4rem)",
            lineHeight: 1.05, margin: 0, color: C.cream, letterSpacing: "0.02em",
          }}>
            ABOUT<br />THE FURNACE
          </h1>
        </div>
        <p style={{ ...P, fontSize: "1.12rem", color: C.cream, opacity: 0.88 }}>
          The Furnace is a utility-based NFT collection where your NFT doesn't just sit in
          your wallet — it works and earns for you.
        </p>
      </Section>

      <Seam />

      <Section tone="ash">
        <Heading>How does it work?</Heading>
        <Steps items={[
          "You mint a Furnace NFT on OpenSea.",
          "Then head to the website and activate The Forge.",
          "Activating the Forge creates an ERC-6551 token-bound wallet for your NFT. This wallet is tied directly to your Furnace.",
          "Whenever an NFT from the collection is traded, the fees generated are deposited into a public royalty pool — so anyone can verify and see what's happening on-chain.",
          "Your Furnace then uses funds from this pool to melt stocks into its ERC-6551 wallet.",
          "Those stocks can continue to grow over time by generating interest.",
        ]} />
      </Section>

      <Seam />

      <Section>
        <Heading>What happens when you withdraw?</Heading>
        <p style={P}>
          You can withdraw the stocks from your Furnace whenever you want. But there's a catch.
        </p>
        <div style={{
          border: `2px solid ${C.ember}`, borderRadius: 4, padding: "22px 22px 20px",
          background: C.ash, boxShadow: `0 0 30px ${C.ember}1a`, maxWidth: "60ch",
        }}>
          <p style={{
            fontFamily: display, fontWeight: 700, fontSize: "0.82rem", color: C.ember,
            margin: "0 0 12px", letterSpacing: "0.05em",
          }}>
            WITHDRAWING BURNS THE FURNACE
          </p>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: C.cream, opacity: 0.85, margin: 0 }}>
            Taking the stocks out burns the NFT. Once the Furnace is burned, the wallet and
            the NFT are both gone. It's a one-way door — worth being sure before you open it.
          </p>
        </div>
      </Section>

      <Seam />

      <Section tone="ash">
        <Heading>What if you sell your Furnace?</Heading>
        <p style={P}>
          This is where it gets interesting. Because the stocks are held inside the NFT's
          ERC-6551 wallet, selling the Furnace transfers everything inside that wallet to
          the buyer along with it.
        </p>
        <p style={P}>
          So if your Furnace contains $500 worth of stocks, you aren't just selling the
          JPEG — you're selling the NFT and the assets attached to it. Which means you
          should think carefully before accepting a floor-price offer.
        </p>

        <div style={{ marginTop: 34, borderTop: `1px solid ${C.line}`, paddingTop: 30 }}>
          {["IT'S NOT JUST AN NFT.", "IT'S A WALLET.", "IT'S A VAULT.", "IT'S BUILT TO WORK FOR YOU."].map((line, i) => (
            <p key={line} style={{
              fontFamily: display, fontWeight: 700,
              fontSize: "clamp(1.05rem,3.6vw,1.75rem)", lineHeight: 1.35,
              margin: 0, letterSpacing: "0.02em",
              color: i === 3 ? C.ember : C.cream,
              opacity: i === 3 ? 1 : 0.5 + i * 0.16,
            }}>{line}</p>
          ))}
        </div>
      </Section>

      <Seam />

      <Section>
        <div style={{ textAlign: "center" }}>
          <Heading>Get on the list</Heading>
          <p style={{ ...P, margin: "0 auto 28px", textAlign: "center" }}>
            Mint access runs through the whitelist. It closes before mint opens.
          </p>
          <Ember onClick={() => setWl(true)}>JOIN THE WHITELIST</Ember>
        </div>
      </Section>
    </Layout>
  );
}
