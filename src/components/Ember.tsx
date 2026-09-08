import { useEffect, useRef } from "react";
import { C } from "@/lib/theme";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Ember = {
  x: number; y: number; vx: number; vy: number;
  size: number; life: number; max: number; flicker: number;
};

/* Slow, quiet drift — squares rising and flickering, never bursting.
   Fills whatever positioned ancestor it's dropped into, so the same
   component works inside the hero or behind the nav menu. */
export default function Embers({ density = 24 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced()) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const parent = canvas?.parentElement;
    if (!canvas || !ctx || !parent) return;

    let w = 0, h = 0, raf: number;
    let particles: Ember[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent!.clientWidth;
      h = parent!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.imageSmoothingEnabled = false;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawn = (seed = false): Ember => ({
      x: Math.random() * w,
      y: seed ? Math.random() * h : h + 8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(0.16 + Math.random() * 0.32),
      size: 1 + Math.floor(Math.random() * 2),
      life: 0,
      max: 280 + Math.random() * 300,
      flicker: Math.random() * Math.PI * 2,
    });

    particles = Array.from({ length: density }, () => spawn(true));

    function tick() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.flicker += 0.05;

        const t = p.life / p.max;
        const fade = t < 0.15 ? t / 0.15 : t > 0.82 ? (1 - t) / 0.18 : 1;
        const flick = 0.5 + Math.sin(p.flicker) * 0.32;

        ctx!.globalAlpha = Math.max(0, fade * flick * 0.6);
        ctx!.fillStyle = Math.random() > 0.85 ? C.flame : C.ember;
        ctx!.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx!.globalAlpha = 1;
      particles = particles.filter((p) => p.life < p.max && p.y > -12);
      while (particles.length < density) particles.push(spawn());
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
