import { useEffect, useRef } from "react";
import "./Wallpaper.css";

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** 노을 진 언덕 배경. 테마(라이트/다크)와 창 크기가 바뀌면 다시 그린다. */
function paint(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, cssVar("--sky-a"));
  sky.addColorStop(0.45, cssVar("--sky-b"));
  sky.addColorStop(0.78, cssVar("--sky-c"));
  sky.addColorStop(1, cssVar("--sky-d"));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.32, H * 0.86, 0, W * 0.32, H * 0.86, Math.max(W, H) * 0.45);
  glow.addColorStop(0, "rgba(255,220,170,.5)");
  glow.addColorStop(1, "rgba(255,220,170,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const hills: Array<[number, number, string]> = [
    [0.72, 0.1, "rgba(30,20,60,.35)"],
    [0.8, 0.08, "rgba(25,15,50,.5)"],
    [0.88, 0.06, "rgba(15,10,35,.7)"],
  ];
  hills.forEach(([base, amp, color], i) => {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const y = H * base + Math.sin(x / (150 + i * 60) + i * 1.7) * H * amp * 0.5 + Math.sin(x / (53 + i * 20) + i) * H * amp * 0.18;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  });

  // 별: 매번 같은 자리에 찍히도록 고정 시드 난수
  let seed = 1;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  ctx.fillStyle = "rgba(255,255,255,.7)";
  for (let i = 0; i < 90; i++) {
    const x = rand() * W;
    const y = rand() * H * 0.45;
    const size = rand() * 1.3 + 0.2;
    ctx.globalAlpha = 0.25 + rand() * 0.6;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
}

export function Wallpaper() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const redraw = () => paint(canvas);
    redraw();
    window.addEventListener("resize", redraw);
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", redraw);
    const observer = new MutationObserver(redraw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      window.removeEventListener("resize", redraw);
      scheme.removeEventListener("change", redraw);
      observer.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="wallpaper" aria-hidden="true" />;
}
