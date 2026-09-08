import { useEffect, useRef, useState } from "react";
import { C } from "@/lib/theme";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Heat: rises to 1 on any click, then cools back to 0.
      The hero reads this to brighten its background. ── */
export function useHeat() {
  const [heat, setHeat] = useState(0);
  const value = useRef(0);
  const frame = useRef<number>();

  useEffect(() => {
    if (reduced()) return;

    const cool = () => {
      value.current *= 0.935;
      if (value.current < 0.004) {
        value.current = 0;
        setHeat(0);
        return;
      }
      setHeat(value.current);
      frame.current = requestAnimationFrame(cool);
    };

    const strike = () => {
      const wasCold = value.current === 0;
      value.current = 1;
      setHeat(1);
      if (wasCold) frame.current = requestAnimationFrame(cool);
    };

    window.addEventListener("pointerdown", strike);
    return () => {
      window.removeEventListener("pointerdown", strike);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return heat;
}

type Spark = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; hot: boolean;
};

/* ── Sparks are drawn as squares, not circles, so they read
      as pixels rather than as a generic particle effect. ── */
export default function SparkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const running = useRef(false);

  useEffect(() => {
    if (reduced()) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const alive: Spark[] = [];

      for (const s of sparks.current) {
        s.life += 1;
        s.vy += 0.13;           // gravity
        s.vx *= 0.985;          // drag
        s.x += s.vx;
        s.y += s.vy;

        const t = s.life / s.max;
        if (t >= 1) continue;

        // Cools from flame to ember as it falls.
        ctx.globalAlpha = 1 - t * t;
        ctx.fillStyle = s.hot && t < 0.45 ? C.flame : C.ember;
        const px = Math.round(s.size);
        ctx.fillRect(Math.round(s.x), Math.round(s.y), px, px);
        alive.push(s);
      }

      ctx.globalAlpha = 1;
      sparks.current = alive;

      if (alive.length) requestAnimationFrame(tick);
      else running.current = false;
    };

    const burst = (e: PointerEvent) => {
      const n = 22 + Math.floor(Math.random() * 10);
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const speed = 1.4 + Math.random() * 4.2;
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 34 + Math.random() * 46,
          size: 2 + Math.floor(Math.random() * 3),
          hot: Math.random() > 0.4,
        });
      }
      // Cap so rapid clicking can't pile up work.
      if (sparks.current.length > 320) sparks.current.splice(0, sparks.current.length - 320);
      if (!running.current) {
        running.current = true;
        requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointerdown", burst);
    return () => {
      window.removeEventListener("pointerdown", burst);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        pointerEvents: "none", mixBlendMode: "screen",
      }}
    />
  );
}
