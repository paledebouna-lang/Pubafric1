import type { ReactNode } from "react";

// Illustrations de couverture des missions : une scène par type de mission, dans les couleurs
// de la charte. Dessinées en SVG (aucun fichier à charger, nettes sur tous les écrans).
// Pour utiliser une vraie photo à la place, il suffira de remplacer ce composant.

const PALETTE: Record<string, [string, string]> = {
  TROUVER_LISTE: ["#2f4b7c", "#3f6bb0"],
  DONNER_AVIS: ["#e8622c", "#f08a3c"],
  RECOMMANDER: ["#1e7145", "#2fa066"],
  INSCRIPTION_SITE: ["#223a63", "#2f4b7c"],
  REPONDRE_ETUDE: ["#c1272d", "#e8622c"],
  RESEAU_SOCIAL: ["#2f4b7c", "#7a3f8f"],
  VIDEO: ["#241a14", "#5a3a2a"],
  DEFI_CHALLENGE: ["#e3a008", "#e8622c"],
  CONTENU_CREATIF: ["#7a3f8f", "#c1272d"],
  EVENEMENT_LOCAL: ["#1e7145", "#e3a008"],
  MUSIQUE_STREAM: ["#223a63", "#c1272d"],
  AUTRE: ["#2f4b7c", "#1e7145"],
  TSHIRT: ["#c1272d", "#e3a008"],
  IDEE: ["#223a63", "#e3a008"],
};

const STAR = "0,-14 4,-4 15,-4 6,3 9,14 0,7 -9,14 -6,3 -15,-4 -4,-4";
const SOFT = "#eef1f6";
const LINE = "#cfd6e2";

function scene(variant: string): ReactNode {
  switch (variant) {
    case "TROUVER_LISTE":
      return (
        <>
          <rect x="120" y="36" width="160" height="164" rx="14" fill="#fff" />
          <rect x="120" y="36" width="160" height="30" rx="14" fill="#e3a008" />
          {[92, 128, 164].map((y) => (
            <g key={y}>
              <circle cx="148" cy={y} r="10" fill="#1e7145" />
              <path d={`M143 ${y} l4 4 l7 -8`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="168" y={y - 8} width="88" height="7" rx="3.5" fill={LINE} />
              <rect x="168" y={y + 3} width="56" height="6" rx="3" fill={SOFT} />
            </g>
          ))}
          <circle cx="292" cy="170" r="26" fill="none" stroke="#fff" strokeWidth="9" />
          <path d="M311 189 l24 24" stroke="#fff" strokeWidth="11" strokeLinecap="round" />
        </>
      );
    case "DONNER_AVIS":
      return (
        <>
          <rect x="80" y="40" width="240" height="126" rx="26" fill="#fff" />
          <polygon points="140,164 120,204 182,164" fill="#fff" />
          {[0, 1, 2, 3, 4].map((i) => (
            <polygon key={i} points={STAR} transform={`translate(${128 + i * 36} 96) scale(1.15)`} fill={i < 4 ? "#e3a008" : LINE} />
          ))}
          <rect x="112" y="128" width="176" height="8" rx="4" fill={LINE} />
          <rect x="112" y="144" width="110" height="8" rx="4" fill={SOFT} />
        </>
      );
    case "RECOMMANDER":
      return (
        <>
          <path d="M172 92 v-18 a28 28 0 0 1 56 0 v18" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" />
          <rect x="138" y="88" width="124" height="112" rx="12" fill="#fff" />
          <path d="M200 176 C168 152 176 128 200 144 C224 128 232 152 200 176Z" fill="#c1272d" />
          <circle cx="98" cy="70" r="6" fill="#e3a008" />
          <circle cx="312" cy="128" r="9" fill="#e3a008" />
          <polygon points={STAR} transform="translate(316 64) scale(1.3)" fill="#e3a008" />
        </>
      );
    case "INSCRIPTION_SITE":
      return (
        <>
          <rect x="66" y="34" width="268" height="172" rx="12" fill="#fff" />
          <rect x="66" y="34" width="268" height="28" rx="12" fill="#e7ebf3" />
          {[86, 102, 118].map((x, i) => (
            <circle key={x} cx={x} cy="48" r="5" fill={["#c1272d", "#e3a008", "#1e7145"][i]} />
          ))}
          <rect x="94" y="82" width="212" height="24" rx="6" fill={SOFT} />
          <rect x="94" y="118" width="212" height="24" rx="6" fill={SOFT} />
          <rect x="94" y="158" width="116" height="28" rx="14" fill="#e3a008" />
          <polygon points="270,150 270,192 282,182 292,204 300,200 290,178 306,178" fill="#241a14" />
        </>
      );
    case "REPONDRE_ETUDE":
      return (
        <>
          <rect x="84" y="36" width="232" height="168" rx="14" fill="#fff" />
          {[
            [116, 60, "#2f4b7c"],
            [156, 90, "#1e7145"],
            [196, 50, "#e3a008"],
            [236, 110, "#e8622c"],
            [276, 76, "#c1272d"],
          ].map(([x, h, c]) => (
            <rect key={x as number} x={(x as number) - 12} y={180 - (h as number)} width="24" height={h as number} rx="4" fill={c as string} />
          ))}
          <rect x="104" y="181" width="192" height="4" rx="2" fill={LINE} />
          <rect x="104" y="52" width="80" height="8" rx="4" fill={LINE} />
        </>
      );
    case "RESEAU_SOCIAL":
      return (
        <>
          <line x1="250" y1="90" x2="320" y2="60" stroke="#fff" strokeWidth="4" />
          <line x1="250" y1="130" x2="326" y2="164" stroke="#fff" strokeWidth="4" />
          <line x1="150" y1="110" x2="80" y2="80" stroke="#fff" strokeWidth="4" />
          <circle cx="322" cy="58" r="17" fill="#e3a008" />
          <circle cx="330" cy="168" r="17" fill="#e8622c" />
          <circle cx="76" cy="78" r="17" fill="#1e7145" />
          <rect x="148" y="24" width="104" height="192" rx="20" fill="#fff" />
          <rect x="158" y="46" width="84" height="148" rx="8" fill={SOFT} />
          <path d="M200 148 C162 118 172 84 200 104 C228 84 238 118 200 148Z" fill="#c1272d" />
          <rect x="176" y="160" width="48" height="6" rx="3" fill={LINE} />
        </>
      );
    case "VIDEO":
      return (
        <>
          <rect x="72" y="44" width="256" height="152" rx="18" fill="#fff" />
          <rect x="84" y="56" width="232" height="128" rx="10" fill="#241a14" />
          <circle cx="200" cy="120" r="34" fill="#e3a008" />
          <polygon points="190,102 190,138 222,120" fill="#fff" />
          <circle cx="102" cy="72" r="6" fill="#c1272d" />
          <rect x="114" y="68" width="30" height="7" rx="3.5" fill="#fff" opacity=".7" />
          <rect x="100" y="166" width="200" height="5" rx="2.5" fill="#fff" opacity=".35" />
          <rect x="100" y="166" width="90" height="5" rx="2.5" fill="#e3a008" />
        </>
      );
    case "DEFI_CHALLENGE":
      return (
        <>
          <path d="M156 56 h88 v42 a44 44 0 0 1 -88 0z" fill="#fff" />
          <path d="M156 68 h-26 a26 26 0 0 0 26 42" stroke="#fff" strokeWidth="9" fill="none" />
          <path d="M244 68 h26 a26 26 0 0 1 -26 42" stroke="#fff" strokeWidth="9" fill="none" />
          <rect x="192" y="140" width="16" height="32" fill="#fff" />
          <rect x="158" y="172" width="84" height="16" rx="6" fill="#fff" />
          <polygon points={STAR} transform="translate(200 94) scale(1.9)" fill="#e3a008" />
          <circle cx="98" cy="60" r="8" fill="#fff" opacity=".7" />
          <circle cx="312" cy="176" r="10" fill="#fff" opacity=".7" />
        </>
      );
    case "CONTENU_CREATIF":
      return (
        <>
          <rect x="80" y="40" width="210" height="152" rx="12" fill="#fff" />
          <rect x="94" y="54" width="182" height="124" rx="6" fill="#cfe6ff" />
          <circle cx="238" cy="88" r="20" fill="#e3a008" />
          <polygon points="94,178 154,104 200,158 226,132 276,178" fill="#1e7145" />
          <g transform="rotate(38 320 120)">
            <rect x="306" y="46" width="28" height="120" rx="4" fill="#e3a008" />
            <polygon points="306,166 334,166 320,196" fill="#f3d9a4" />
            <rect x="306" y="46" width="28" height="18" rx="4" fill="#c1272d" />
          </g>
        </>
      );
    case "EVENEMENT_LOCAL":
      return (
        <>
          <rect x="56" y="36" width="288" height="168" rx="14" fill="#f4ecd8" />
          <path d="M56 120 H344 M150 36 V204 M260 36 V204" stroke="#fff" strokeWidth="12" />
          <rect x="176" y="140" width="64" height="40" rx="6" fill="#cfe3c8" />
          <path d="M200 52 c-26 0 -40 20 -40 40 c0 28 40 72 40 72 s40 -44 40 -72 c0 -20 -14 -40 -40 -40z" fill="#c1272d" />
          <circle cx="200" cy="92" r="15" fill="#fff" />
        </>
      );
    case "MUSIQUE_STREAM":
      return (
        <>
          <path d="M112 150 v-30 a88 88 0 0 1 176 0 v30" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" />
          <rect x="92" y="136" width="38" height="66" rx="14" fill="#fff" />
          <rect x="270" y="136" width="38" height="66" rx="14" fill="#fff" />
          <circle cx="182" cy="152" r="12" fill="#e3a008" />
          <rect x="192" y="96" width="7" height="56" fill="#e3a008" />
          <path d="M199 96 q26 6 26 26" stroke="#e3a008" strokeWidth="7" fill="none" />
          <circle cx="250" cy="176" r="7" fill="#fff" opacity=".7" />
        </>
      );
    case "TSHIRT":
      return (
        <>
          <path d="M146 52 l-66 34 l26 42 l28 -14 v100 h132 v-100 l28 14 l26 -42 l-66 -34 c-12 18 -32 26 -54 26 s-42 -8 -54 -26z" fill="#fff" />
          <circle cx="200" cy="112" r="24" fill="#e3a008" />
          <path d="M188 112 l9 9 l16 -18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="166" y="152" width="68" height="7" rx="3.5" fill={LINE} />
        </>
      );
    case "IDEE":
      return (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1="200" y1="100" x2="200" y2="34" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".8" transform={`rotate(${-90 + i * 30} 200 100)`} />
          ))}
          <circle cx="200" cy="100" r="52" fill="#e3a008" />
          <path d="M184 100 q8 -22 16 0 t16 0" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="176" y="150" width="48" height="34" rx="8" fill="#fff" />
          <rect x="182" y="184" width="36" height="14" rx="7" fill="#fff" />
        </>
      );
    default:
      return (
        <>
          <path d="M200 30 Q208 108 290 120 Q208 132 200 210 Q192 132 110 120 Q192 108 200 30z" fill="#fff" />
          <path d="M310 40 Q313 62 334 66 Q313 70 310 92 Q307 70 286 66 Q307 62 310 40z" fill="#e3a008" />
          <path d="M92 150 Q95 168 112 172 Q95 176 92 194 Q89 176 72 172 Q89 168 92 150z" fill="#e3a008" />
        </>
      );
  }
}

export default function MissionCover({
  variant,
  label,
  className = "",
}: {
  variant: string;
  label?: string;
  className?: string;
}) {
  const key = PALETTE[variant] ? variant : "AUTRE";
  const [c1, c2] = PALETTE[key];
  const gid = `cover-${key}`;

  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${gid})`} />
      <circle cx="350" cy="30" r="96" fill="#fff" opacity=".08" />
      <circle cx="30" cy="230" r="112" fill="#fff" opacity=".07" />
      {scene(key)}
      {["#c1272d", "#e3a008", "#1e7145", "#241a14"].map((c, i) => (
        <rect key={c} x={i * 100} y="232" width="100" height="8" fill={c} />
      ))}
    </svg>
  );
}
