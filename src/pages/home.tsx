import { useState } from "react";
import { Link } from "wouter";
import Layout, { Section, Seam, Heading, Ember, ConnectButton } from "@/components/Layout";
import Whitelist from "@/components/Whitelist";
import { useHeat } from "@/components/Sparks";
import { C, display, HERO_BG, FURNACE, OPENSEA } from "@/lib/theme";

export default function Home() {
  const [wl, setWl] = useState(false);
  const heat = useHeat();

  /* Everything in the hero is driven by one value, so the whole
     scene flares together instead of animating in pieces. */
  const brightness = 0.30 + heat * 0.62;
  const glow = 0.18 + heat * 0.72;

  return (
    <Layout>
      <Whitelist open={wl} onClose={() => setWl(false)} />

      {/* ══ HERO ══ */}
      <section style={{
        position: "relative", minHeight: "calc(100vh - 66px)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "56px 20px 72px",
        overflow: "hidden", textAlign: "center",
      }}>
        {/* Background plate — dark at rest, flares when the page is clicked. */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover", backgroundPosition: "center",
          imageRendering: "pixelated",
          filter: `brightness(${brightness}) saturate(${0.75 + heat * 0.5}) contrast(1.05)`,
          transition: "filter 90ms linear",
        }} />
        {/* Ember wash that rises out of the plate with the heat. */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 58%, ${C.ember}${Math.round(glow * 60).toString(16).padStart(2, "0")} 0%, transparent 62%),
                       linear-gradient(180deg, ${C.coal}cc 0%, transparent 32%, ${C.coal}dd 100%)`,
          transition: "background 90ms linear",
        }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 760 }}>
          <img src={FURNACE} alt="The Furnace" style={{
            width: "min(300px, 62vw)", height: "auto", display: "block", margin: "0 auto",
            filter: `drop-shadow(0 0 ${14 + heat * 46}px ${C.ember}${Math.round((0.5 + heat * 0.5) * 255).toString(16).padStart(2, "0")})`,
            transition: "filter 90ms linear",
          }} />

          <p style={{
            fontFamily: display, fontWeight: 400,
            fontSize: "clamp(0.72rem,2.6vw,1rem)", letterSpacing: "0.34em",
            color: C.flame, margin: "30px 0 10px", textIndent: "0.34em",
          }}>
            WELCOME TO
          </p>

          <h1 style={{
            fontFamily: display, fontWeight: 700,
            fontSize: "clamp(2.1rem,10vw,5.2rem)", lineHeight: 1,
            letterSpacing: "0.02em", margin: "0 0 22px", color: C.cream,
            textShadow: `0 0 ${18 + heat * 40}px ${C.ember}${Math.round((0.35 + heat * 0.6) * 255).toString(16).padStart(2, "0")}`,
            transition: "text-shadow 90ms linear",
          }}>
            THE FURNACE
          </h1>

          <p style={{
            fontSize: "clamp(0.98rem,2.4vw,1.12rem)", lineHeight: 1.75,
            color: C.cream, opacity: 0.82, margin: "0 auto 32px", maxWidth: "44ch",
          }}>
            An NFT that doesn't just sit in your wallet. It holds one, earns from every
            trade in the collection, and hands the whole thing over when you sell.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <Ember onClick={() => setWl(true)}>JOIN THE WHITELIST</Ember>
            <Ember href={OPENSEA} tone="ghost">OPENSEA</Ember>
          </div>

          <p style={{
            fontFamily: display, fontSize: "0.6rem", letterSpacing: "0.2em",
            color: C.faint, margin: "34px 0 0",
          }}>
            CLICK ANYWHERE TO STOKE IT
          </p>
        </div>
      </section>

      <Seam />

      {/* ══ WHAT IT IS ══ */}
      <Section tone="ash">
        <Heading size="lg">Your NFT goes to work</Heading>
        <p style={{ fontSize: "1.02rem", lineHeight: 1.85, color: C.muted, maxWidth: "58ch", margin: "0 0 34px" }}>
          Every Furnace opens a wallet of its own. Trading fees from the collection flow
          into a public pool, and each activated Furnace melts stocks from that pool into
          its own wallet — where they keep growing.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 2,
          background: C.iron, border: `2px solid ${C.iron}`,
        }}>
          {[
            ["MINT", "Pick up a Furnace on OpenSea."],
            ["ACTIVATE", "Light the Forge here and it opens its own wallet."],
            ["EARN", "Trading fees melt into stocks inside it."],
            ["DECIDE", "Withdraw and burn it, or sell it with everything inside."],
          ].map(([title, copy]) => (
            <div key={title} style={{ background: C.ash, padding: "24px 20px" }}>
              <p style={{ fontFamily: display, fontWeight: 700, fontSize: "0.78rem", color: C.ember, margin: "0 0 9px", letterSpacing: "0.06em" }}>
                {title}
              </p>
              <p style={{ fontSize: "0.94rem", lineHeight: 1.7, color: C.muted, margin: 0 }}>{copy}</p>
            </div>
          ))}
        </div>

        <Link href="/about" style={{
          display: "inline-block", marginTop: 30, fontFamily: display, fontWeight: 700,
          fontSize: "0.8rem", letterSpacing: "0.03em", color: C.cream,
          border: `2px solid ${C.ironUp}`, borderRadius: 4, padding: "16px 28px",
          transition: "border-color .16s, color .16s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ember; e.currentTarget.style.color = C.ember; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.ironUp; e.currentTarget.style.color = C.cream; }}
        >
          READ HOW IT WORKS
        </Link>
      </Section>

      <Seam />

      {/* ══ WHITELIST ══ */}
      <Section>
        <div style={{ textAlign: "center", maxWidth: "50ch", margin: "0 auto" }}>
          <Heading size="lg">The whitelist is the way in</Heading>
          <p style={{ fontSize: "1.02rem", lineHeight: 1.8, color: C.muted, margin: "0 0 30px" }}>
            Four short steps, one wallet, and you're in the queue. The list closes before
            mint opens, and it doesn't reopen.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <Ember onClick={() => setWl(true)}>JOIN THE WHITELIST</Ember>
            <ConnectButton />
          </div>
        </div>
      </Section>
    </Layout>
  );
}
