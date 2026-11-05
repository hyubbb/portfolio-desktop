import type { Box } from "../lib/rect";
import "./MarqueeBox.css";

export function MarqueeBox({ box }: { box: Box | null }) {
  if (!box) return null;
  return (
    <div
      className="marquee-box"
      style={{ left: box.left, top: box.top, width: box.right - box.left, height: box.bottom - box.top }}
    />
  );
}
