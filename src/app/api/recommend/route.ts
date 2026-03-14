import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import products from "@/data/products.json";
import inspirationTags from "@/data/inspiration-tags.json";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Product = (typeof products)[0];
type InspirationTags = typeof inspirationTags;

function scoreProduct(
  product: Product,
  roomInfo: {
    theme?: string;
    colors?: string[];
    maxBudget?: number;
  },
  refinementSignals?: {
    boostColors?: string[];
    reduceColors?: string[];
    boostCategories?: string[];
    boostStyles?: string[];
    reduceStyles?: string[];
    reduceBudget?: boolean;
    boostPlants?: boolean;
    boostCozy?: boolean;
  }
): number {
  let score = 1;
  const theme = roomInfo.theme?.toLowerCase() ?? "";
  const colors = (roomInfo.colors ?? []).map((c) => c.toLowerCase());
  const maxBudget = roomInfo.maxBudget ?? 2000;

  if (product.price > maxBudget) return 0;

  const productColors = [product.color, ...product.style_tags].join(" ").toLowerCase();
  const productStyles = product.style_tags.map((s) => s.toLowerCase());

  if (theme && inspirationTags[theme as keyof InspirationTags]) {
    const tagConfig = inspirationTags[theme as keyof InspirationTags];
    const kwMatch = tagConfig.keywords.some((k) =>
      productStyles.some((ps) => ps.includes(k) || k.includes(ps))
    );
    if (kwMatch) score *= 1.5;
    if (tagConfig.preferred_categories?.includes(product.category)) score *= 1.3;
    if (tagConfig.avoid?.some((a) => productStyles.some((ps) => ps.includes(a)))) score *= 0.3;
  }

  colors.forEach((c) => {
    if (productColors.includes(c)) score *= 1.4;
  });

  if (refinementSignals?.boostColors?.length) {
    refinementSignals.boostColors.forEach((c) => {
      if (productColors.includes(c.toLowerCase())) score *= 1.6;
    });
  }
  if (refinementSignals?.reduceColors?.length) {
    refinementSignals.reduceColors.forEach((c) => {
      if (productColors.includes(c.toLowerCase())) score *= 0.2;
    });
  }
  if (refinementSignals?.boostCategories?.length) {
    if (refinementSignals.boostCategories.includes(product.category)) score *= 1.8;
  }
  if (refinementSignals?.reduceStyles?.length) {
    if (refinementSignals.reduceStyles.some((s) => productStyles.some((ps) => ps.includes(s))))
      score *= 0.4;
  }
  if (refinementSignals?.boostStyles?.length) {
    if (refinementSignals.boostStyles.some((s) => productStyles.some((ps) => ps.includes(s))))
      score *= 1.5;
  }
  if (refinementSignals?.reduceBudget) {
    if (product.price < 100) score *= 1.3;
  }
  if (refinementSignals?.boostPlants && product.category === "plants") score *= 2;
  if (refinementSignals?.boostCozy) {
    if (productStyles.some((s) => ["cozy", "warm", "soft", "textured"].includes(s))) score *= 1.6;
  }

  return score;
}

function parseRefinementSignals(prompt: string): {
  boostColors?: string[];
  reduceColors?: string[];
  boostCategories?: string[];
  boostStyles?: string[];
  reduceStyles?: string[];
  reduceBudget?: boolean;
  boostPlants?: boolean;
  boostCozy?: boolean;
} {
  const p = prompt.toLowerCase();
  const signals: ReturnType<typeof parseRefinementSignals> = {};

  if (/\bmore\s+green\b|\bgreener\b|\badd\s+green\b/.test(p)) {
    signals.boostColors = [...(signals.boostColors ?? []), "green"];
  }
  if (/\bmore\s+pink\b|\badd\s+pink\b|\ba?\s*lot\s+of\s+pink\b|\bpink\b/.test(p) && !/\bless\s+pink\b|\bno\s+pink\b|\breduce\s+pink\b/.test(p)) {
    signals.boostColors = [...(signals.boostColors ?? []), "pink"];
  }
  if (/\bless\s+pink\b|\bno\s+pink\b|\breduce\s+pink\b/.test(p)) {
    signals.reduceColors = [...(signals.reduceColors ?? []), "pink"];
  }
  if (/\badd\s+more\s+plants\b|\bmore\s+plants\b|\bplants\b/.test(p)) {
    signals.boostPlants = true;
  }
  if (/\bfairy\s+lights\b|\bstring\s+lights\b|\blights\b/.test(p)) {
    signals.boostCategories = [...(signals.boostCategories ?? []), "string lights"];
  }
  if (/\bvsco\b|\bpastel\b|\bcottage\s+core\b/.test(p)) {
    signals.boostStyles = [...(signals.boostStyles ?? []), "pastel", "soft", "cozy"];
  }
  if (/\bminimalist\b|\bminimal\b|\bsimpler\b/.test(p)) {
    signals.boostStyles = [...(signals.boostStyles ?? []), "minimalist", "modern", "clean"];
    signals.reduceStyles = ["bold", "vintage", "textured"];
  }
  if (/\breduce\s+(the\s+)?(total\s+)?cost\b|\bcheaper\b|\blower\s+budget\b|\bless\s+expensive\b/.test(p)) {
    signals.reduceBudget = true;
  }
  if (/\bcozy\b|\bcozier\b|\bwarmer\b|\bsofter\b/.test(p)) {
    signals.boostCozy = true;
  }

  return signals;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomInfo = {},
      refinementPrompt,
      existingProductIds = [],
    }: {
      roomInfo?: { theme?: string; colors?: string[]; maxBudget?: number };
      refinementPrompt?: string;
      existingProductIds?: string[];
    } = body;

    const refinementSignals = refinementPrompt ? parseRefinementSignals(refinementPrompt) : undefined;

    const seenImages = new Set<string>();
    const scored = (products as Product[])
      .filter((p) => !existingProductIds.includes(p.id))
      .map((p) => ({ product: p, score: scoreProduct(p, roomInfo, refinementSignals) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .filter(({ product }) => {
        if (seenImages.has(product.image_url)) return false;
        seenImages.add(product.image_url);
        return true;
      });

    const count = Math.min(12, scored.length);
    let recommended = scored.slice(0, count).map((x) => x.product);

    // Fallback: if scoring filtered everything out, return first 12 products
    if (recommended.length === 0) {
      recommended = (products as Product[]).slice(0, 12);
    }

    if (process.env.OPENAI_API_KEY && refinementPrompt) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a decor recommender. Given product IDs from a catalog, return a JSON array of up to 12 product IDs that best match the user's refinement. Product IDs are strings like "1","2", etc. Available product IDs go from 1 to 40. Only return valid IDs. Format: {"ids":["1","2",...]}`,
            },
            {
              role: "user",
              content: `User refinement: "${refinementPrompt}". Room info: theme=${roomInfo.theme}, colors=${JSON.stringify(roomInfo.colors)}, maxBudget=${roomInfo.maxBudget}. Current top scored IDs: ${scored.slice(0, 20).map((s) => s.product.id).join(",")}. Return a JSON object with "ids" array of best 12 product IDs.`,
            },
          ],
          max_tokens: 200,
        });
        const text = completion.choices[0]?.message?.content ?? "";
        const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
        if (Array.isArray(parsed.ids) && parsed.ids.length > 0) {
          const byId = new Map((products as Product[]).map((p) => [p.id, p]));
          const aiPicked = parsed.ids
            .map((id: string) => byId.get(String(id)))
            .filter(Boolean) as Product[];
          if (aiPicked.length >= 6) {
            return NextResponse.json({ products: aiPicked.slice(0, 12) });
          }
        }
      } catch {
        /* fallback to scored results below */
      }
    }

    return NextResponse.json({ products: recommended });
  } catch (error) {
    console.error("Recommend API error:", error);
    // Return fallback products so the moodboard always shows something
    const fallback = (products as Product[]).slice(0, 12);
    return NextResponse.json({ products: fallback });
  }
}
