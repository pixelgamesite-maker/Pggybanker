import { Router as WouterRouter, Route, Switch, Link } from "wouter";

import Home from "@/pages/home";
import About from "@/pages/about";
import Faq from "@/pages/faq";
import { C, display, body } from "@/lib/theme";

function NotFound() {
  return (
    <div style={{
      background: C.coal, minHeight: "100vh", fontFamily: body,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16, padding: 24, textAlign: "center",
    }}>
      <p style={{
        fontFamily: display, fontWeight: 700, fontSize: "clamp(1.6rem,7vw,2.8rem)",
        color: C.cream, margin: 0, letterSpacing: "0.03em",
        textShadow: `0 0 24px ${C.ember}66`,
      }}>
        COLD
      </p>
      <p style={{ color: C.muted, margin: 0, maxWidth: "38ch", lineHeight: 1.75 }}>
        There's nothing burning at this address. The link is wrong, not the Furnace.
      </p>
      <Link href="/" style={{
        fontFamily: display, fontWeight: 700, fontSize: "0.76rem", letterSpacing: "0.04em",
        color: C.coal, background: C.ember, padding: "15px 26px", marginTop: 8,
        borderRadius: 4, boxShadow: `0 0 24px ${C.ember}44`,
      }}>
        BACK TO THE FURNACE
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="dark">
      <WouterRouter>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/faq" component={Faq} />
          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
    </div>
  );
}
