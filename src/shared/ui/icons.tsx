import { useId } from "react";

/* 바탕화면(64×56)과 독(54×54)에서 쓰는 아이콘. 브랜드 로고 대신 직접 그린 범용 그림만 쓴다. */

export function FolderIcon({ size = "desktop" }: { size?: "desktop" | "dock" }) {
  const id = useId();
  const paths = (
    <>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc4f8" />
          <stop offset="1" stopColor="#3d97e6" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a6dafd" />
          <stop offset="1" stopColor="#5fb1f2" />
        </linearGradient>
      </defs>
      <path d="M2 8a4 4 0 0 1 4-4h14l5 5h23a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill={`url(#${id}b)`} />
      <path d="M2 16a4 4 0 0 1 4-4h42a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill={`url(#${id}f)`} />
    </>
  );
  return size === "dock" ? (
    <svg viewBox="0 0 54 54" aria-hidden="true"><g transform="translate(1 3)">{paths}</g></svg>
  ) : (
    <svg viewBox="0 0 64 56" aria-hidden="true"><g transform="translate(5 4)">{paths}</g></svg>
  );
}

const PAPER = (
  <>
    <path d="M16 3h22l12 12v36a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" fill="#fbfbfd" />
    <path d="M38 3v10a2 2 0 0 0 2 2h10z" fill="#d9dbe2" />
  </>
);

export function DocIcon() {
  return (
    <svg viewBox="0 0 64 56" aria-hidden="true">
      {PAPER}
      <g stroke="#a3a7b3" strokeWidth="2" strokeLinecap="round">
        <path d="M20 24h22M20 30h22M20 36h16M20 42h20" />
      </g>
    </svg>
  );
}

export function PageIcon() {
  const id = useId();
  return (
    <svg viewBox="0 0 64 56" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f7fa3" />
          <stop offset="1" stopColor="#103e57" />
        </linearGradient>
      </defs>
      {PAPER}
      <rect x="18" y="22" width="28" height="22" rx="5" fill={`url(#${id})`} />
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M23 29h9M21 33h11M23 37h9" />
        <path d="M35 28l5 5-5 5" strokeLinejoin="round" />
      </g>
      <text x="32" y="16" textAnchor="middle" fontFamily="monospace" fontSize="6" fontWeight="700" fill="#8d92a0">HTML</text>
    </svg>
  );
}

export type ProjectGlyph = "chat" | "cup" | "grid" | "stream" | "pdf" | "upload" | "engine" | "lanes";

function Glyph({ glyph, color }: { glyph: ProjectGlyph; color: string }) {
  if (glyph === "chat")
    return <path d="M24 25h16a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-8l-5 4v-4h-3a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z" fill="#fff" />;
  if (glyph === "cup")
    return (
      <>
        <path d="M25 25h14l-2 14a3 3 0 0 1-3 2.6h-4a3 3 0 0 1-3-2.6z" fill="#fff" />
        <path d="M27 30h10" stroke={color} strokeWidth="2" />
      </>
    );
  if (glyph === "lanes")
    return (
      <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M23 28h11M21 33h13M23 38h11" />
        <path d="M37 27l5 6-5 6" strokeLinejoin="round" />
      </g>
    );
  if (glyph === "stream")
    return (
      <g fill="#fff">
        <rect x="22" y="29" width="5" height="10" rx="1.5" />
        <rect x="29" y="29" width="5" height="10" rx="1.5" opacity=".75" />
        <rect x="36" y="29" width="5" height="10" rx="1.5" opacity=".5" />
        <path d="M43 30l4 4-4 4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  if (glyph === "pdf")
    return (
      <g>
        <path d="M26 24h9l5 5v13a1.5 1.5 0 0 1-1.5 1.5h-12.5a1.5 1.5 0 0 1-1.5-1.5v-16.5a1.5 1.5 0 0 1 1.5-1.5z" fill="#fff" />
        <rect x="27" y="33" width="11" height="2" rx="1" fill={color} />
        <rect x="27" y="37" width="8" height="2" rx="1" fill={color} opacity=".6" />
      </g>
    );
  if (glyph === "upload")
    return (
      <g stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 41V27M26 32l6-6 6 6" />
        <path d="M24 43h16" />
      </g>
    );
  if (glyph === "engine")
    return (
      <g fill="#fff">
        <rect x="22" y="25" width="7" height="7" rx="2" />
        <rect x="35" y="25" width="7" height="7" rx="2" opacity=".7" />
        <rect x="28.5" y="36" width="7" height="7" rx="2" />
        <path d="M29 28.5h6M25.5 32l4 4M38.5 32l-4 4" stroke="#fff" strokeWidth="1.6" />
      </g>
    );
  const cells = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => ({ r, c })));
  return (
    <g fill="#fff">
      {cells.map(({ r, c }) => (
        <rect key={`${r}${c}`} x={23 + c * 7} y={24 + r * 7} width="5" height="5" rx="1" opacity={(r + c) % 2 ? 0.55 : 1} />
      ))}
    </g>
  );
}

export function ProjectIcon({ color, glyph, tag = "WEB" }: { color: string; glyph: ProjectGlyph; tag?: string }) {
  return (
    <svg viewBox="0 0 64 56" aria-hidden="true">
      {PAPER}
      <rect x="18" y="20" width="28" height="26" rx="6" fill={color} />
      <Glyph glyph={glyph} color={color} />
      <text x="31" y="15" textAnchor="middle" fontFamily="monospace" fontSize="6" fontWeight="700" fill="#8d92a0">{tag}</text>
    </svg>
  );
}

/** git 브랜치 모양 (GitHub 공식 로고는 쓰지 않음) */
export function GitIcon({ size = "desktop" }: { size?: "desktop" | "dock" }) {
  const desktop = size === "desktop";
  return (
    <svg viewBox={desktop ? "0 0 64 56" : "0 0 54 54"} aria-hidden="true">
      <g transform={desktop ? "translate(7 3)" : "translate(2 2)"}>
        <rect width="50" height="50" rx="12" fill="#24292f" />
        <g stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M17 12v26" />
          <path d="M33 18c0 9-16 7-16 16" />
        </g>
        <g fill="#24292f" stroke="#fff" strokeWidth="3">
          <circle cx="17" cy="12" r="4" />
          <circle cx="17" cy="38" r="4" />
          <circle cx="33" cy="15" r="4" />
        </g>
      </g>
    </svg>
  );
}

export function FastlaneTile() {
  const id = useId();
  return (
    <svg viewBox="0 0 54 54" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f7fa3" />
          <stop offset="1" stopColor="#103e57" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="50" height="50" rx="12" fill={`url(#${id})`} />
      <g stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M12 19h18M8 27h24M12 35h18" />
        <path d="M34 15l9 12-9 12" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function DocTile() {
  return (
    <svg viewBox="0 0 54 54" aria-hidden="true">
      <rect x="2" y="2" width="50" height="50" rx="12" fill="#f4f4f7" />
      <g stroke="#8d92a0" strokeWidth="2.6" strokeLinecap="round">
        <path d="M14 18h26M14 26h26M14 34h18" />
      </g>
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 54 54" aria-hidden="true">
      <path d="M14 14h26l-3 34a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" fill="rgba(235,240,248,.75)" stroke="rgba(255,255,255,.9)" strokeWidth="1.4" />
      <rect x="11" y="10" width="32" height="5" rx="2.5" fill="rgba(245,248,252,.9)" />
      <g stroke="rgba(120,130,150,.6)" strokeWidth="1.6">
        <path d="M22 20l1 26M27 20v26M32 20l-1 26" />
      </g>
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="6.3" />
      <path d="M1.8 8h12.4M8 1.7c-2.2 2.4-2.2 10.2 0 12.6M8 1.7c2.2 2.4 2.2 10.2 0 12.6" />
    </svg>
  );
}

export function RepoIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 2.5A1.5 1.5 0 0 1 4.5 1h8v12h-8A1.5 1.5 0 0 0 3 14.5zM3 14.5A1.5 1.5 0 0 1 4.5 13h8v2h-8A1.5 1.5 0 0 1 3 14.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
