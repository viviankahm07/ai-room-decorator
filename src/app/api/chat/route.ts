import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an AI room decorator assistant. Your job is to help users decorate a room by gathering their preferences and guiding the design process.

You should ask the user for (in a conversational way, not all at once):
1. Room dimensions (e.g., "12x15 feet")
2. Room type (bedroom, living room, office, bathroom, etc.)
3. Design theme/aesthetic (minimalist, cozy, boho, vintage, modern, pastel, nature, etc.)
4. Preferred colors
5. Maximum budget in dollars

When the user provides information, acknowledge it and ask for the next piece if needed. Once you have enough info, say you're generating their moodboard.

You also support REFINEMENT requests. When the user says things like:
- "make it more green and less pink" → emphasize green items, de-prioritize pink
- "add more plants" → favor plant category
- "make it more minimalist" → favor minimalist, modern, clean styles
- "reduce the total cost" → favor cheaper items
- "more cozy" → favor warm, soft, textured items

For refinements, respond with a friendly message confirming the change, then the system will regenerate the moodboard.

Keep responses concise (1-3 sentences). Be warm and design-savvy.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
    });
    const content = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get chat response" },
      { status: 500 }
    );
  }
}
