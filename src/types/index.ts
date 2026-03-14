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
