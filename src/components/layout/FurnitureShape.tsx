import type { FurnitureShapeType } from "@/types";

interface FurnitureShapeProps {
  type: FurnitureShapeType;
  selected?: boolean;
}

// Palette derived from the app's warm color theme
const C = {
  frame: "#b8a898",
  body: "#d4c5b0",
  accent: "#968E59",
  plum: "#6B2E52",
  teal: "#2E676B",
  cream: "#f0ebe4",
  white: "#faf8f5",
  green: "#5a7a5a",
  greenDark: "#4a6a4a",
};

export default function FurnitureShape({ type, selected }: FurnitureShapeProps) {
  const stroke = selected ? "#6B2E52" : C.frame;

  switch (type) {
    case "bed":
      return (
        <svg viewBox="0 0 100 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="96" height="156" rx="6" fill={C.body} stroke={stroke} strokeWidth="2" />
          <rect x="2" y="2" width="96" height="30" rx="6" fill={C.accent} stroke={stroke} strokeWidth="2" />
          <rect x="8" y="34" width="84" height="118" rx="4" fill={C.cream} />
          <rect x="12" y="40" width="32" height="22" rx="9" fill={C.white} stroke="#e0d8d0" strokeWidth="1.5" />
          <rect x="56" y="40" width="32" height="22" rx="9" fill={C.white} stroke="#e0d8d0" strokeWidth="1.5" />
        </svg>
      );

    case "desk":
      return (
        <svg viewBox="0 0 140 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="136" height="66" rx="4" fill={C.body} stroke={stroke} strokeWidth="2" />
          <rect x="45" y="8" width="52" height="34" rx="3" fill="#888" opacity="0.25" />
          <rect x="65" y="44" width="12" height="10" rx="2" fill="#999" opacity="0.3" />
          <rect x="8" y="8" width="22" height="26" rx="2" fill={C.cream} stroke="#ddd" strokeWidth="1" />
          <rect x="110" y="8" width="22" height="26" rx="2" fill={C.cream} stroke="#ddd" strokeWidth="1" />
        </svg>
      );

    case "chair":
      return (
        <svg viewBox="0 0 80 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="2" width="64" height="22" rx="8" fill={C.accent} stroke={stroke} strokeWidth="2" />
          <rect x="8" y="26" width="64" height="58" rx="10" fill={C.body} stroke={stroke} strokeWidth="2" />
          <rect x="16" y="34" width="48" height="42" rx="7" fill={C.cream} />
        </svg>
      );

    case "rug":
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="156" height="96" rx="12" fill="#ebccde" stroke={stroke} strokeWidth="2.5" />
          <rect x="12" y="12" width="136" height="76" rx="8" fill="none" stroke={C.plum} strokeWidth="1.5" strokeDasharray="5 3" />
          <rect x="24" y="24" width="112" height="52" rx="5" fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
          <circle cx="80" cy="50" r="10" fill="none" stroke={C.plum} strokeWidth="1.5" opacity="0.4" />
        </svg>
      );

    case "plant":
      return (
        <svg viewBox="0 0 60 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="62" rx="16" ry="7" fill={C.accent} stroke={stroke} strokeWidth="1.5" />
          <rect x="24" y="46" width="12" height="18" rx="2" fill={C.accent} stroke={stroke} strokeWidth="1" />
          <circle cx="30" cy="32" r="18" fill={C.green} />
          <circle cx="18" cy="24" r="11" fill={C.greenDark} />
          <circle cx="42" cy="24" r="11" fill={C.greenDark} />
          <circle cx="30" cy="16" r="10" fill="#3d5e3d" />
        </svg>
      );

    case "lamp":
      return (
        <svg viewBox="0 0 50 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 36 L42 36 L34 14 L16 14 Z" fill={C.cream} stroke={stroke} strokeWidth="1.5" />
          <line x1="25" y1="36" x2="25" y2="56" stroke={C.frame} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="25" cy="58" rx="14" ry="5" fill={C.body} stroke={stroke} strokeWidth="1.5" />
          <circle cx="25" cy="14" r="3" fill="#ffe8a0" opacity="0.8" />
        </svg>
      );

    case "shelf":
      return (
        <svg viewBox="0 0 160 50" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="156" height="46" rx="3" fill={C.body} stroke={stroke} strokeWidth="2" />
          <line x1="56" y1="4" x2="56" y2="46" stroke={stroke} strokeWidth="1.5" />
          <line x1="106" y1="4" x2="106" y2="46" stroke={stroke} strokeWidth="1.5" />
          <rect x="8" y="10" width="8" height="28" rx="1" fill={C.plum} opacity="0.5" />
          <rect x="18" y="14" width="7" height="24" rx="1" fill={C.accent} opacity="0.6" />
          <rect x="27" y="10" width="10" height="28" rx="1" fill={C.teal} opacity="0.4" />
          <rect x="62" y="12" width="9" height="26" rx="1" fill={C.accent} opacity="0.5" />
          <rect x="73" y="10" width="7" height="28" rx="1" fill={C.plum} opacity="0.3" />
          <rect x="112" y="14" width="8" height="24" rx="1" fill={C.teal} opacity="0.5" />
          <rect x="122" y="10" width="9" height="28" rx="1" fill={C.accent} opacity="0.6" />
        </svg>
      );

    case "nightstand":
      return (
        <svg viewBox="0 0 70 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="66" height="66" rx="5" fill={C.body} stroke={stroke} strokeWidth="2" />
          <rect x="10" y="22" width="50" height="20" rx="3" fill={C.accent} stroke={stroke} strokeWidth="1" />
          <circle cx="35" cy="32" r="4" fill={C.frame} />
          <rect x="14" y="8" width="42" height="10" rx="2" fill={C.cream} stroke="#ddd" strokeWidth="1" />
        </svg>
      );

    case "dresser":
      return (
        <svg viewBox="0 0 110 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="106" height="86" rx="5" fill={C.body} stroke={stroke} strokeWidth="2" />
          <rect x="8" y="8" width="94" height="20" rx="2" fill={C.accent} stroke={stroke} strokeWidth="1" />
          <circle cx="55" cy="18" r="4" fill={C.frame} />
          <rect x="8" y="33" width="94" height="20" rx="2" fill={C.accent} stroke={stroke} strokeWidth="1" />
          <circle cx="55" cy="43" r="4" fill={C.frame} />
          <rect x="8" y="58" width="94" height="20" rx="2" fill={C.accent} stroke={stroke} strokeWidth="1" />
          <circle cx="55" cy="68" r="4" fill={C.frame} />
        </svg>
      );

    case "sofa":
      return (
        <svg viewBox="0 0 200 90" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="196" height="32" rx="10" fill={C.accent} stroke={stroke} strokeWidth="2" />
          <rect x="2" y="36" width="196" height="50" rx="7" fill={C.body} stroke={stroke} strokeWidth="2" />
          <rect x="8" y="42" width="85" height="36" rx="6" fill={C.cream} stroke="#ddd" strokeWidth="1" />
          <rect x="107" y="42" width="85" height="36" rx="6" fill={C.cream} stroke="#ddd" strokeWidth="1" />
          <rect x="2" y="36" width="20" height="50" rx="7" fill={C.accent} stroke={stroke} strokeWidth="1.5" />
          <rect x="178" y="36" width="20" height="50" rx="7" fill={C.accent} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );

    case "mirror":
      return (
        <svg viewBox="0 0 60 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="46" rx="26" ry="40" fill={C.body} stroke={stroke} strokeWidth="2" />
          <ellipse cx="30" cy="46" rx="20" ry="34" fill="#dce8eb" stroke={C.teal} strokeWidth="1" opacity="0.8" />
          <line x1="16" y1="32" x2="24" y2="24" stroke="white" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <rect x="22" y="88" width="16" height="10" rx="2" fill={C.accent} stroke={stroke} strokeWidth="1" />
        </svg>
      );

    case "pillow":
      return (
        <svg viewBox="0 0 80 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="76" height="56" rx="12" fill="#ebccde" stroke={stroke} strokeWidth="2" />
          <rect x="10" y="10" width="60" height="40" rx="8" fill="#f5dde8" />
          <line x1="40" y1="12" x2="40" y2="48" stroke={C.plum} strokeWidth="1" opacity="0.3" />
          <line x1="12" y1="30" x2="68" y2="30" stroke={C.plum} strokeWidth="1" opacity="0.3" />
        </svg>
      );

    case "art":
    default:
      return (
        <svg viewBox="0 0 80 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="76" height="66" rx="4" fill={C.cream} stroke={stroke} strokeWidth="2.5" />
          <rect x="10" y="10" width="60" height="50" rx="2" fill="#e8f0f2" />
          <path d="M10 45 L28 28 L44 38 L58 22 L70 35 L70 60 L10 60 Z" fill={C.teal} opacity="0.2" />
          <circle cx="58" cy="22" r="6" fill="#ffe8a0" opacity="0.5" />
        </svg>
      );
  }
}

// Utility: detect shape type from product category/name.
// More specific checks come first; no space-boundary requirements.
export function detectShapeType(category: string, name: string): FurnitureShapeType {
  const c = category.toLowerCase();
  const n = name.toLowerCase();

  // Most specific first to avoid false matches
  if (n.includes("nightstand") || n.includes("night stand") || n.includes("bedside") || n.includes("side table")) return "nightstand";
  if (n.includes("sofa") || n.includes("couch") || n.includes("loveseat") || c.includes("sofa")) return "sofa";
  if (n.includes("dresser") || n.includes("chest of drawer") || n.includes("wardrobe") || c.includes("dresser")) return "dresser";
  if (n.includes("bookcase") || n.includes("bookshelf") || n.includes("shelving") || n.includes("shelf") || n.includes("shelves")) return "shelf";
  if (n.includes("mirror") || c.includes("mirror")) return "mirror";
  if (n.includes("rug") || n.includes("carpet") || (n.includes("mat") && !n.includes("material")) || c.includes("rug") || c.includes("carpet")) return "rug";
  if (n.includes("pillow") || n.includes("cushion") || n.includes("throw pillow") || c.includes("pillow")) return "pillow";
  if (n.includes("lamp") || n.includes("sconce") || n.includes("chandelier") || c.includes("lamp") || c.includes("lighting")) return "lamp";
  if (n.includes("plant") || n.includes("succulent") || n.includes("cactus") || n.includes("flower pot") || n.includes("potted") || n.includes("botanical") || c.includes("plant")) return "plant";
  if (n.includes("chair") || n.includes("stool") || n.includes("seating") || c.includes("chair")) return "chair";
  if (n.includes("desk") || n.includes("workstation") || (n.includes("table") && !n.includes("end table"))) return "desk";
  if (n.includes("end table")) return "nightstand";
  if (n.includes("bed") || n.includes("comforter") || n.includes("duvet") || n.includes("bedding") || c.includes("bedding")) return "bed";
  if (n.includes("wall art") || n.includes("wall decor") || n.includes("wall hanging") || n.includes("tapestry") || n.includes("poster") || n.includes("print") || n.includes("canvas")) return "art";

  // Broader category fallbacks
  if (c.includes("rug")) return "rug";
  if (c.includes("light")) return "lamp";
  if (c.includes("pillow") || c.includes("cushion")) return "pillow";
  if (c.includes("chair") || c.includes("seating")) return "chair";
  if (c.includes("desk") || c.includes("table")) return "desk";
  if (c.includes("bed")) return "bed";
  if (c.includes("shelf") || c.includes("storage")) return "shelf";

  return "art";
}

// Default dimensions (width × depth in feet) per shape
export const SHAPE_DEFAULTS: Record<FurnitureShapeType, { width: number; depth: number }> = {
  bed:        { width: 4.5, depth: 6.5 },
  desk:       { width: 4.0, depth: 2.0 },
  chair:      { width: 2.5, depth: 2.5 },
  rug:        { width: 5.0, depth: 8.0 },
  plant:      { width: 1.5, depth: 1.5 },
  lamp:       { width: 1.5, depth: 1.5 },
  shelf:      { width: 4.0, depth: 1.0 },
  nightstand: { width: 2.0, depth: 2.0 },
  dresser:    { width: 3.5, depth: 1.5 },
  sofa:       { width: 7.0, depth: 3.0 },
  mirror:     { width: 2.0, depth: 0.5 },
  pillow:     { width: 1.5, depth: 1.5 },
  art:        { width: 2.0, depth: 2.0 },
};
