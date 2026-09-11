import { useEffect, useState } from "react";
import { C, display, body, X_URL, PINNED_URL } from "@/lib/theme";
import { submitApplication } from "@/lib/supabase";
import { isValidEvm } from "@/lib/wallet";

/* Stricter than a generic URL check — the pasted link has to actually
   point at x.com (or the old twitter.com domain), since a random link
   isn't proof of anything happening on X. */
function isXLink(u: string) {
  try {
    const p = new URL(u.trim());
    if (p.protocol !== "https:" && p.protocol !== "http:") return false;
    const host = p.hostname.replace(/^www\./, "").toLowerCase();
    return host === "x.com" || host === "twitter.com";
  } catch { return false; }
}

const input: React.CSSProperties = {
  width: "100%", background: C.coal, color: C.cream,
  border: `2px solid ${C.iron}`, borderRadius: 3,
  padding: "12px 13px", fontSize: "0.95rem", fontFamily: body,
  outline: "none", boxSizing: "border-box",
};

/* Progress reads as a heat gauge — it gets hotter, not longer. */
function Gauge({ done }: { done: boolean[] }) {
  const n = done.filter(Boolean).length;
  const total = done.length;
  return (
    <div>
      <div style={{ display: "flex", gap: 4, height: 14 }}>
        {done.map((d, i) => (
          <div key={i} style={{
            flex: 1,
            background: d ? (i < Math.ceil(total / 2) ? C.ember : C.flame) : C.iron,
            boxShadow: d ? `0 0 12px ${i < Math.ceil(total / 2) ? C.ember : C.flame}88` : "none",
            transition: "background .3s, box-shadow .3s",
          }} />
        ))}
      </div>
      <p style={{ fontFamily: display, fontSize: "0.66rem", color: n === total ? C.flame : C.faint, margin: "9px 0 0", letterSpacing: "0.05em" }}>
        {n === total ? "AT TEMPERATURE" : `HEAT ${n} / ${total}`}
      </p>
    </div>
  );
}

function Step({
  n, title, hint, done, locked, children,
}: { n: number; title: string; hint: string; done: boolean; locked: boolean; children?: React.ReactNode }) {
  return (
    <div style={{
      border: `2px solid ${done ? C.ember : locked ? C.line : C.iron}`,
      borderRadius: 4, padding: "15px 15px 13px", marginBottom: 9,
      background: locked ? "transparent" : C.coal,
      opacity: locked ? 0.4 : 1,
      boxShadow: done ? `0 0 16px ${C.ember}22` : "none",
      transition: "border-color .25s, box-shadow .25s, opacity .25s",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: locked ? 0 : 10 }}>
        <span style={{ fontFamily: display, fontSize: "0.72rem", fontWeight: 700, color: done ? C.flame : C.ember }}>
          {String(n).padStart(2, "0")}
        </span>
        <div>
          <p style={{ fontFamily: display, fontSize: "0.8rem", fontWeight: 700, margin: 0, color: C.cream, letterSpacing: "0.02em" }}>
            {title}
          </p>
          <p style={{ fontSize: "0.88rem", color: C.muted, margin: "5px 0 0", lineHeight: 1.55 }}>{hint}</p>
        </div>
      </div>
      {!locked && children}
    </div>
  );
}

function Small({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      marginTop: 9, width: "100%", background: "transparent", color: C.ember,
      border: `2px solid ${C.ember}`, borderRadius: 3, padding: "10px",
      fontFamily: display, fontSize: "0.68rem", fontWeight: 700, cursor: "pointer",
      letterSpacing: "0.04em", transition: "background .15s, color .15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.ember; e.currentTarget.style.color = C.coal; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ember; }}
    >{children}</button>
  );
}

/* Purely cosmetic — the code comes from the wallet address itself, so it's
   free to generate and always the same for the same wallet, but nothing
   reads it back or tracks who shared what. Labeled as such in the UI so
   nobody mistakes it for a real referral-rewards mechanic. */
function ReferralBox({ wallet }: { wallet: string }) {
  const [copied, setCopied] = useState(false);
  const code = wallet.replace(/^0x/i, "").slice(0, 6).toUpperCase();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://thefurnacexyz.xyz";
  const link = `${origin}/?ref=${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — the input itself is still selectable */ }
  }

  return (
    <div style={{ marginTop: 26, textAlign: "left" }}>
      <p style={{ fontFamily: display, fontSize: "0.62rem", letterSpacing: "0.06em", color: C.faint, margin: "0 0 8px" }}>
        YOUR LINK — JUST FOR FUN, DOESN'T TRACK ANYTHING
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input readOnly value={link} onFocus={(e) => e.target.select()} style={{
          ...input, flex: 1, color: C.flame, fontFamily: display, fontSize: "0.76rem", cursor: "text",
        }} />
        <button onClick={copy} style={{
          flexShrink: 0, fontFamily: display, fontWeight: 700, fontSize: "0.66rem",
          color: copied ? C.coal : C.ember, background: copied ? C.flame : "transparent",
          border: `2px solid ${copied ? C.flame : C.ember}`, borderRadius: 3,
          padding: "0 16px", cursor: "pointer", transition: "background .15s, color .15s, border-color .15s",
        }}>
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
    </div>
  );
}

/* A link box shared by the two submission steps — opens the post,
   takes a pasted link, validates it's actually an x.com URL. */
function LinkStep({
  value, onChange, onSave, saved, placeholder, launchLabel, launchTo,
}: {
  value: string; onChange: (v: string) => void; onSave: () => void; saved: boolean;
  placeholder: string; launchLabel: string; launchTo: string;
}) {
  return (
    <>
      <Small onClick={() => window.open(launchTo, "_blank", "noopener")}>{launchLabel}</Small>
      <input value={value} style={{ ...input, marginTop: 9 }} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && isXLink(value) && onSave()}
        onFocus={(e) => (e.target.style.borderColor = C.ember)}
        onBlur={(e) => (e.target.style.borderColor = C.iron)} />
      {value && !isXLink(value) && (
        <p style={{ fontSize: "0.82rem", color: C.ember, margin: "6px 0 0" }}>
          Needs to be a real x.com link — paste the full URL from the address bar or the Share button.
        </p>
      )}
      {isXLink(value) && !saved && <Small onClick={onSave}>SAVE LINK</Small>}
    </>
  );
}

export default function Whitelist({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [handle, setHandle] = useState("");
  const [handleOk, setHandleOk] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [quoteLink, setQuoteLink] = useState("");
  const [quoteOk, setQuoteOk] = useState(false);
  const [commentLink, setCommentLink] = useState("");
  const [commentOk, setCommentOk] = useState(false);
  const [manual, setManual] = useState("");
  const [manualOk, setManualOk] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [already, setAlready] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("furnace_wl") ?? "{}");
      setHandle(s.handle ?? ""); setQuoteLink(s.quoteLink ?? "");
      setCommentLink(s.commentLink ?? ""); setManual(s.manual ?? "");
      setFollowed(!!s.followed);
      if (localStorage.getItem("furnace_wl_sent") === "true") setAlready(true);
    } catch { /* first visit */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("furnace_wl", JSON.stringify({ handle, quoteLink, commentLink, manual, followed }));
  }, [handle, quoteLink, commentLink, manual, followed]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  const s1 = handleOk && handle.trim().length > 1;
  const s2 = followed;
  const s3 = quoteOk && isXLink(quoteLink);
  const s4 = commentOk && isXLink(commentLink);
  const s5 = manualOk && isValidEvm(manual);
  const all = s1 && s2 && s3 && s4 && s5;

  async function send() {
    if (!all) { setErr("Finish all five steps first."); return; }
    if (already) { setErr("This browser has already sent an application."); return; }
    setErr(""); setSending(true);
    const { error } = await submitApplication({
      wallet: manual, twitter: handle,
      quote_url: quoteLink, comment_url: commentLink,
    });
    setSending(false);
    if (error) {
      setErr(/duplicate|unique/i.test(error.message ?? "")
        ? "That wallet is already on the list."
        : "That didn't save. Check your connection and try again.");
      return;
    }
    localStorage.setItem("furnace_wl_sent", "true");
    setSent(true); setAlready(true);
  }

  if (!open) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 200, padding: 14,
        background: "rgba(8,5,4,0.93)", backdropFilter: "blur(9px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Whitelist application" style={{
        width: "100%", maxWidth: 460, maxHeight: "93vh", overflowY: "auto",
        background: C.ash, border: `2px solid ${C.ironUp}`, borderRadius: 6,
        padding: "24px 20px 22px", position: "relative", fontFamily: body,
        boxShadow: `0 0 60px ${C.ember}18`, animation: "rise .22s ease both",
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: "absolute", top: 12, right: 14, background: "none", border: "none",
          cursor: "pointer", color: C.faint, fontSize: "1.25rem", lineHeight: 1,
        }}>✕</button>

        {sent || already ? (
          <div style={{ textAlign: "center", padding: "32px 0 14px" }}>
            <div style={{
              width: 58, height: 58, margin: "0 auto 18px", background: C.ember,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.6rem", color: C.coal, boxShadow: `0 0 34px ${C.ember}88`,
            }}>✓</div>
            <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "1.15rem", margin: "0 0 10px", color: C.cream }}>
              {sent ? "YOU'RE IN THE QUEUE" : "ALREADY APPLIED"}
            </h2>
            <p style={{ color: C.muted, margin: 0, lineHeight: 1.7, fontSize: "0.95rem" }}>
              Your entry is recorded. Selected wallets are added before mint — watch X for the announcement.
            </p>
            {isValidEvm(manual) && <ReferralBox wallet={manual} />}
            <div style={{ marginTop: 20 }}><Small onClick={onClose}>BACK TO THE SITE</Small></div>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: display, fontWeight: 700, fontSize: "1.15rem", margin: "0 0 8px", color: C.cream, letterSpacing: "0.02em" }}>
              THE WHITELIST
            </h2>
            <p style={{ color: C.muted, fontSize: "0.92rem", lineHeight: 1.65, margin: "0 0 18px" }}>
              Five steps to get the Furnace hot. Finish them and drop your wallet in.
            </p>

            <div style={{ marginBottom: 18 }}><Gauge done={[s1, s2, s3, s4, s5]} /></div>

            <Step n={1} title="YOUR X HANDLE" hint="So we can match your account to your wallet." done={s1} locked={false}>
              <input value={handle} style={input} placeholder="@yourhandle"
                onChange={(e) => { setHandle(e.target.value); setHandleOk(false); }}
                onKeyDown={(e) => e.key === "Enter" && setHandleOk(true)}
                onFocus={(e) => (e.target.style.borderColor = C.ember)}
                onBlur={(e) => (e.target.style.borderColor = C.iron)} />
              {!s1 && handle.trim().length > 1 && <Small onClick={() => setHandleOk(true)}>SAVE HANDLE</Small>}
            </Step>

            <Step n={2} title="FOLLOW" hint="Follow @thefurnacexyz on X." done={s2} locked={!s1}>
              {!s2 && (
                <Small onClick={() => {
                  window.open(X_URL, "_blank", "noopener");
                  setTimeout(() => setFollowed(true), 900);
                }}>OPEN X</Small>
              )}
            </Step>

            <Step n={3} title="LIKE & QUOTE" hint="Like the pinned post, then quote it with a bullish caption — tell people why you're excited. Paste your quote tweet link below." done={s3} locked={!s2}>
              {!s3 && (
                <LinkStep
                  value={quoteLink}
                  onChange={(v) => { setQuoteLink(v); setQuoteOk(false); }}
                  onSave={() => setQuoteOk(true)}
                  saved={s3}
                  placeholder="https://x.com/you/status/…"
                  launchLabel="OPEN THE POST"
                  launchTo={PINNED_URL}
                />
              )}
            </Step>

            <Step n={4} title="TAG 3 FRIENDS" hint="Drop a comment on the pinned post tagging 3 friends. Paste the link to your comment below." done={s4} locked={!s3}>
              {!s4 && (
                <LinkStep
                  value={commentLink}
                  onChange={(v) => { setCommentLink(v); setCommentOk(false); }}
                  onSave={() => setCommentOk(true)}
                  saved={s4}
                  placeholder="https://x.com/you/status/…"
                  launchLabel="OPEN THE POST"
                  launchTo={PINNED_URL}
                />
              )}
            </Step>

            <Step n={5} title="YOUR WALLET" hint="Paste the address you'll mint with." done={s5} locked={!s4}>
              <input value={manual} style={input} placeholder="0x…"
                onChange={(e) => { setManual(e.target.value); setManualOk(false); }}
                onKeyDown={(e) => e.key === "Enter" && isValidEvm(manual) && setManualOk(true)}
                onFocus={(e) => (e.target.style.borderColor = C.ember)}
                onBlur={(e) => (e.target.style.borderColor = C.iron)} />
              {manual && !isValidEvm(manual) && (
                <p style={{ fontSize: "0.82rem", color: C.ember, margin: "6px 0 0" }}>
                  That isn't a valid address. It should be 42 characters starting with 0x.
                </p>
              )}
              {!s5 && isValidEvm(manual) && <Small onClick={() => setManualOk(true)}>SAVE ADDRESS</Small>}
              <p style={{ fontSize: "0.8rem", color: C.faint, margin: "10px 0 0", lineHeight: 1.55 }}>
                We only need your public address. Nobody from The Furnace will ever ask for a seed phrase.
              </p>
            </Step>

            {err && <p style={{ color: C.ember, fontSize: "0.88rem", margin: "12px 0 0" }}>{err}</p>}

            <button onClick={send} disabled={!all || sending} style={{
              width: "100%", marginTop: 14, padding: "16px",
              background: all ? C.ember : "transparent",
              color: all ? C.coal : C.faint,
              border: `2px solid ${all ? C.ember : C.iron}`,
              borderRadius: 4, fontFamily: display, fontSize: "0.8rem", fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: all && !sending ? "pointer" : "not-allowed",
              boxShadow: all ? `0 0 26px ${C.ember}55` : "none",
              transition: "background .2s, color .2s, border-color .2s, box-shadow .2s",
            }}>
              {sending ? "SAVING…" : all ? "JOIN THE WHITELIST" : "FINISH ALL FIVE STEPS"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
