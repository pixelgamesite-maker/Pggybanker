/* ─────────────────────────────────────────────
   THE FURNACE — design tokens
   Two heat temperatures (ember, flame) over warm
   coal. Nothing here is neutral grey; every dark
   value carries a little red in it.
   ───────────────────────────────────────────── */

export const C = {
  coal:   "#0B0806",  // page base — warm black
  ash:    "#15100C",  // raised panels
  iron:   "#221913",  // borders, inputs
  ironUp: "#33251B",  // hover borders
  ember:  "#FF6A1F",  // primary heat — actions
  flame:  "#FFB43D",  // hotter heat — value, success
  scorch: "#8A2E0B",  // dim ember, used for rims
  cream:  "#FFF1E4",  // text
  muted:  "rgba(255,241,228,0.55)",
  faint:  "rgba(255,241,228,0.28)",
  line:   "rgba(255,241,228,0.10)",
} as const;

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Pixelify+Sans:wght@400;500;600;700&display=swap";

/** Blocky display face — headlines only. */
export const display = "'Silkscreen', 'Courier New', monospace";
/** Readable pixel face — body, UI, labels. */
export const body = "'Pixelify Sans', 'Courier New', monospace";

/* ── Project constants — everything you'd edit lives here ── */
export const CONTRACT = "0x93eac0fdff74d0d1c3e132e26473d755e495d1f7";
export const CHAIN_ID = 1;
export const X_URL      = "https://x.com/thefurnacexyz";
export const PINNED_URL = "https://x.com/thefurnacexyz";  // ← swap for the pinned post
export const OPENSEA    = "https://opensea.io/";          // ← swap for the collection URL

/* ── Assets in /public ── */
export const HERO_BG = "/hero-background.png";
export const FURNACE = "/furnace.png";

/* ── Supabase ── */
export const TABLE = "furnace";
