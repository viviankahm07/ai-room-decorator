export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  color: string;
  material: string;
  style_tags: string[];
  source: string;
  product_url: string;
}

export interface RoomInfo {
  dimensions?: string;
  roomType?: string;
  theme?: string;
  colors?: string[];
  maxBudget?: number;
}

export interface SavedBoard {
  id: string;
  name: string;
  roomInfo: RoomInfo;
  products: Product[];
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  sharedByEmail?: string; // set when this board was shared with the current user
  layoutItems?: LayoutItem[];
  roomDimensions?: RoomDimensions;
}

// ── Layout planner ──────────────────────────────────────────────────────────

export type FurnitureShapeType =
  | "bed" | "desk" | "chair" | "rug" | "plant" | "lamp"
  | "shelf" | "nightstand" | "dresser" | "sofa" | "mirror" | "pillow" | "art";

export interface LayoutItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  shapeType: FurnitureShapeType;
  x: number;        // feet from left wall
  y: number;        // feet from top wall
  width: number;    // feet
  depth: number;    // feet
  rotation: number; // 0 | 90 | 180 | 270
  price: number;
  imageUrl: string;
  productUrl?: string;
}

export interface RoomDimensions {
  width: number;  // feet
  length: number; // feet
}

export interface BoardShare {
  id: string;
  boardId: string;
  sharedWithEmail: string;
  sharedByUserId: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface RecommendationParams {
  roomInfo: RoomInfo;
  refinementPrompt?: string;
  existingProductIds?: string[];
}

export interface InspirationPin {
  id: string;
  url: string;
  full_url: string;
  alt: string;
  photographer: string;
  photographer_link: string;
  unsplash_link: string;
}
