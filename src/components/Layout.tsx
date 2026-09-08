import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { C, display, body, FONT_LINK, FURNACE, X_URL, OPENSEA } from "@/lib/theme";
import { useWallet, shorten } from "@/lib/wallet";
import SparkField from "@/components/Sparks";

/* ── A glowing seam: the structural rule for this site.
      Reads as a strip of molten metal rather than a hairline. ── */
export function Seam() {
  return (
    <div aria-hidden style={{
      height: 2,
      background: `linear-gradient(90deg, transparent, ${C.scorch} 18%, ${C.ember} 50%, ${C.scorch} 82%, transparent)`,
      opacity: 0.65,
    }} />
  );
}

export function Section({
  children, tone = "coal", id,
}: { children: React.ReactNode; tone?: "coal" | "ash"; id?: string }) {
  return (
    <section id={id} style={{
      background: tone === "coal" ? C.coal : C.ash,
      padding: "clamp(56px,9vw,110px) 0",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)" }}>
        {children}
      </div>
    </section>
  );
}

export function Heading({ children, size = "md" }: { children: React.ReactNode; size?: "md" | "lg" }) {
  return (
    <h2 style={{
      fontFamily: display, fontWeight: 700, color: C.cream,
      fontSize: size === "lg" ? "clamp(1.9rem,6vw,3rem)" : "clamp(1.4rem,4.2vw,2.1rem)",
      lineHeight: 1.15, margin: "0 0 18px", letterSpacing: "0.01em",
    }}>{children}</h2>
  );
}

export function Ember({
  onClick, href, children, tone = "solid",
}: {
  onClick?: () => void; href?: string;
  children: React.ReactNode; tone?: "solid" | "ghost";
}) {
  const solid = tone === "solid";
  const style: React.CSSProperties = {
    display: "inline-block", fontFamily: display, fontWeight: 700,
    fontSize: "clamp(0.78rem,2vw,0.92rem)", letterSpacing: "0.02em",
    color: solid ? C.coal : C.cream,
    background: solid ? C.ember : "transparent",
    border: `2px solid ${solid ? C.ember : C.ironUp}`,
    borderRadius: 4, padding: "16px 28px", cursor: "pointer",
    textAlign: "center", transition: "background .16s, border-color .16s, color .16s, box-shadow .16s",
    boxShadow: solid ? `0 0 24px ${C.ember}44` : "none",
  };
  const hoverIn = (el: HTMLElement) => {
    if (solid) { el.style.background = C.flame; el.style.borderColor = C.flame; el.style.boxShadow = `0 0 34px ${C.flame}66`; }
    else { el.style.borderColor = C.ember; el.style.color = C.ember; }
  };
  const hoverOut = (el: HTMLElement) => {
    if (solid) { el.style.background = C.ember; el.style.borderColor = C.ember; el.style.boxShadow = `0 0 24px ${C.ember}44`; }
    else { el.style.borderColor = C.ironUp; el.style.color = C.cream; }
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}
        onMouseEnter={(e) => hoverIn(e.currentTarget)}
        onMouseLeave={(e) => hoverOut(e.currentTarget)}>{children}</a>
    );
  }
  return (
    <button onClick={onClick} style={style}
      onMouseEnter={(e) => hoverIn(e.currentTarget)}
      onMouseLeave={(e) => hoverOut(e.currentTarget)}>{children}</button>
  );
}

const NAV: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["FAQ", "/faq"],
];

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const { address, connect, connecting, disconnect } = useWallet();
  const on = !!address;
  return (
    <button
      onClick={on ? disconnect : connect}
      title={on ? "Click to disconnect" : "Connect your wallet"}
      style={{
        fontFamily: display, fontWeight: 700,
        fontSize: compact ? "0.66rem" : "0.8rem",
        color: on ? C.flame : C.coal,
        background: on ? "transparent" : C.ember,
        border: `2px solid ${on ? C.ironUp : C.ember}`,
        borderRadius: 4, padding: compact ? "9px 13px" : "14px 24px",
        cursor: "pointer", whiteSpace: "nowrap",
        boxShadow: on ? "none" : `0 0 18px ${C.ember}44`,
        transition: "background .16s, border-color .16s, color .16s",
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget;
        if (on) b.style.borderColor = C.ember;
        else b.style.background = C.flame;
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget;
        if (on) b.style.borderColor = C.ironUp;
        else b.style.background = C.ember;
      }}
    >
      {on ? shorten(address!, 5, 4) : connecting ? "CONNECTING" : "CONNECT WALLET"}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
  }, []);

  useEffect(() => setOpen(false), [loc]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div style={{ background: C.coal, color: C.cream, minHeight: "100vh", fontFamily: body, overflowX: "hidden" }}>
      <SparkField />

      <style>{`
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:${C.coal}}
        a{color:inherit;text-decoration:none}
        img{image-rendering:pixelated}
        ::placeholder{color:rgba(255,241,228,0.26)}
        ::selection{background:${C.ember};color:${C.coal}}
        ::-webkit-scrollbar{width:8px}
        ::-webkit-scrollbar-track{background:${C.coal}}
        ::-webkit-scrollbar-thumb{background:${C.ironUp};border-radius:4px}
        :focus-visible{outline:3px solid ${C.flame};outline-offset:3px;border-radius:2px}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes navIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
      `}</style>

      {/* ══ HEADER ══ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60, height: 66,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(14px,4vw,30px)",
        background: "rgba(11,8,6,0.86)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.line}`,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <img src={FURNACE} alt="" width={32} height={32} style={{
            width: 32, height: 32, objectFit: "contain", flexShrink: 0,
            filter: `drop-shadow(0 0 6px ${C.ember}88)`,
          }} />
          <span style={{
            fontFamily: display, fontWeight: 700, fontSize: "0.92rem",
            letterSpacing: "0.04em", whiteSpace: "nowrap",
          }}>THE FURNACE</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ConnectButton compact />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              width: 40, height: 40, borderRadius: 4, cursor: "pointer", flexShrink: 0,
              background: "transparent", border: `2px solid ${C.ironUp}`,
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: 16, height: 2.5, background: C.cream,
                transition: "transform .2s, opacity .2s",
                transform: open
                  ? i === 0 ? "translateY(7.5px) rotate(45deg)"
                  : i === 2 ? "translateY(-7.5px) rotate(-45deg)" : "none"
                  : "none",
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {/* ══ MENU ══ */}
      {open && (
        <nav style={{
          position: "fixed", inset: 0, zIndex: 55, background: C.coal,
          paddingTop: 96, animation: "navIn .2s ease both",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <ul style={{ listStyle: "none", margin: 0, padding: "0 clamp(20px,6vw,60px)" }}>
            {NAV.map(([label, href]) => {
              const active = loc === href;
              return (
                <li key={href} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <Link href={href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "clamp(18px,3.2vw,26px) 0",
                    fontFamily: display, fontWeight: 700,
                    fontSize: "clamp(1.5rem,6vw,2.6rem)", lineHeight: 1,
                    color: active ? C.ember : C.cream,
                  }}>
                    {label.toUpperCase()}
                    {active && <span style={{ width: 10, height: 10, background: C.flame }} />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div style={{
            padding: "0 clamp(20px,6vw,60px) 40px", display: "flex", gap: 22,
            fontSize: "0.95rem", color: C.muted,
          }}>
            <a href={X_URL} target="_blank" rel="noopener noreferrer">X</a>
            <a href={OPENSEA} target="_blank" rel="noopener noreferrer">OpenSea</a>
          </div>
        </nav>
      )}

      <main style={{ paddingTop: 66 }}>{children}</main>

      {/* ══ FOOTER ══ */}
      <Seam />
      <footer style={{ background: C.ash, padding: "48px 0 36px" }}>
        <div style={{
          maxWidth: 980, margin: "0 auto", padding: "0 clamp(20px,5vw,40px)",
          display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "space-between",
        }}>
          <div style={{ maxWidth: 300 }}>
            <img src={FURNACE} alt="" width={40} height={40}
              style={{ width: 40, height: 40, objectFit: "contain", filter: `drop-shadow(0 0 8px ${C.ember}77)` }} />
            <p style={{ fontFamily: display, fontWeight: 700, fontSize: "0.95rem", margin: "12px 0 8px", letterSpacing: "0.04em" }}>
              THE FURNACE
            </p>
            <p style={{ fontSize: "0.92rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>
              An NFT that holds a wallet, earns from trading fees, and hands everything over when you sell it.
            </p>
          </div>
          <div style={{ display: "flex", gap: 44 }}>
            <div>
              <p style={{ fontFamily: display, fontSize: "0.7rem", color: C.faint, margin: "0 0 12px", letterSpacing: "0.06em" }}>PAGES</p>
              {NAV.map(([l, h]) => (
                <Link key={h} href={h} style={{ display: "block", fontSize: "0.92rem", color: C.muted, padding: "5px 0" }}>{l}</Link>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: display, fontSize: "0.7rem", color: C.faint, margin: "0 0 12px", letterSpacing: "0.06em" }}>LINKS</p>
              <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: "0.92rem", color: C.muted, padding: "5px 0" }}>X</a>
              <a href={OPENSEA} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: "0.92rem", color: C.muted, padding: "5px 0" }}>OpenSea</a>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: 980, margin: "34px auto 0", padding: "20px clamp(20px,5vw,40px) 0",
          borderTop: `1px solid ${C.line}`, display: "flex", flexWrap: "wrap",
          gap: 10, justifyContent: "space-between",
        }}>
          <p style={{ fontSize: "0.8rem", color: C.faint, margin: 0 }}>
            A digital collectible. Not financial advice.
          </p>
          <p style={{ fontFamily: display, fontSize: "0.7rem", color: C.faint, margin: 0 }}>
            © {new Date().getFullYear()} THE FURNACE
          </p>
        </div>
      </footer>
    </div>
  );
}
