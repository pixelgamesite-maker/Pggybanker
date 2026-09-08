import { useState } from "react";
import Layout, { Section, Seam, Ember } from "@/components/Layout";
import Whitelist from "@/components/Whitelist";
import { C, display, X_URL } from "@/lib/theme";

const GROUPS: { group: string; items: [string, string][] }[] = [
  {
    group: "THE BASICS",
    items: [
      ["What is The Furnace?", "A utility-based NFT collection. Each Furnace opens a wallet of its own, earns from the collection's trading fees, and carries whatever it holds with it when it changes hands."],
      ["Where do I mint?", "OpenSea. The link is in the menu and on the home page."],
      ["How do I get mint access?", "Through the whitelist. Four steps, one wallet, and it closes before mint opens."],
      ["What's the supply and price?", "Both are announced before the whitelist closes. Watch X — we post there first."],
    ],
  },
  {
    group: "THE FORGE",
    items: [
      ["What does activating the Forge do?", "It creates an ERC-6551 token-bound wallet for your specific NFT. That wallet is tied directly to your Furnace, not to you."],
      ["Do I have to activate it?", "Only activated Furnaces receive stocks from the pool. An unactivated one still works as an NFT, it just isn't earning."],
      ["Where do the earnings come from?", "Every time a Furnace is traded, the fees go into a public royalty pool. On a schedule, the pool converts its balance into stocks and distributes them across all activated Furnaces."],
      ["Can I verify the pool myself?", "Yes. The royalty pool is a public contract, so anyone can check what's flowing in and out on-chain."],
      ["Do the stocks keep growing?", "They can. Stocks held inside a Furnace generate interest over time."],
    ],
  },
  {
    group: "WITHDRAWING AND SELLING",
    items: [
      ["Can I take my stocks out?", "Whenever you want — but withdrawing burns the Furnace. Once it's burned, the NFT and its wallet are both gone permanently."],
      ["What happens if I sell instead?", "Everything inside the Furnace's wallet goes to the buyer with it. You're selling the NFT and the assets attached to it, not just the art."],
      ["So what should I list it at?", "That's the part to think about. If your Furnace holds $500 in stocks, a floor-price offer is not a floor-price sale. Check what's inside before you accept anything."],
      ["Is the wallet custodial? Do you hold keys?", "No. There are no keys for us to hold. Control follows ownership of the NFT on-chain, and we never touch it."],
    ],
  },
  {
    group: "SAFETY",
    items: [
      ["Will you DM me first?", "No. We don't send first DMs, we never ask for seed phrases, and we never ask you to 'validate' or 'sync' a wallet."],
      ["How do I know a link is real?", "Check it came from @thefurnacexyz on X, and check the contract address matches the one published on this site."],
      ["Is this financial advice?", "No. The Furnace is a digital collectible. Only spend what you're comfortable spending."],
    ],
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.line}` }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: "17px 0", display: "flex", gap: 16, alignItems: "flex-start",
        justifyContent: "space-between", textAlign: "left",
      }}>
        <span style={{
          fontSize: "1.02rem", fontWeight: 600, lineHeight: 1.5,
          color: open ? C.ember : C.cream, transition: "color .15s",
        }}>{q}</span>
        <span aria-hidden style={{
          color: C.ember, fontSize: "1.2rem", lineHeight: 1, flexShrink: 0,
          transform: open ? "rotate(45deg)" : "none", transition: "transform .2s",
        }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: "0.98rem", lineHeight: 1.85, color: C.muted, margin: 0, padding: "0 0 20px", maxWidth: "62ch" }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function Faq() {
  const [wl, setWl] = useState(false);

  return (
    <Layout>
      <Whitelist open={wl} onClose={() => setWl(false)} />

      <Section>
        <h1 style={{
          fontFamily: display, fontWeight: 700, fontSize: "clamp(1.9rem,7vw,3.4rem)",
          lineHeight: 1.05, margin: "0 0 18px", color: C.cream, letterSpacing: "0.02em",
        }}>
          FAQ
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: C.muted, maxWidth: "54ch", margin: 0 }}>
          If something here is out of date or missing, ask on X and we'll add it.
        </p>
      </Section>

      <Seam />

      <Section tone="ash">
        {GROUPS.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: 42 }}>
            <p style={{
              fontFamily: display, fontWeight: 700, fontSize: "0.78rem",
              color: C.flame, margin: "0 0 6px", letterSpacing: "0.08em",
            }}>{group}</p>
            {items.map(([q, a]) => <Item key={q} q={q} a={a} />)}
          </div>
        ))}

        <div style={{
          border: `2px solid ${C.iron}`, borderRadius: 4, padding: "26px 24px",
          display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center",
          justifyContent: "space-between", background: C.coal,
        }}>
          <div>
            <p style={{ fontFamily: display, fontWeight: 700, fontSize: "0.82rem", margin: "0 0 8px", color: C.cream, letterSpacing: "0.04em" }}>
              STILL STUCK?
            </p>
            <p style={{ fontSize: "0.95rem", color: C.muted, margin: 0, lineHeight: 1.7 }}>
              We answer in public so everyone gets the same answer.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Ember href={X_URL} tone="ghost">ASK ON X</Ember>
            <Ember onClick={() => setWl(true)}>JOIN THE WHITELIST</Ember>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
