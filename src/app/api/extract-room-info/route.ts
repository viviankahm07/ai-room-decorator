import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!process.env.OPENAI_API_KEY || !messages?.length) {
      return NextResponse.json({
        roomInfo: {},
      });
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Extract room decoration preferences from the conversation. Return ONLY valid JSON:
{
  "dimensions": "string or null (e.g. '12x15 feet')",
  "roomType": "string or null (bedroom, living room, office, etc.)",
  "theme": "string or null (minimalist, cozy, boho, vintage, modern, pastel, nature)",
  "colors": ["array of color strings or empty"],
  "maxBudget": number or null
}
If a field cannot be determined, use null or [].`,
        },
        {
          role: "user",
          content: JSON.stringify(
            messages.map((m: { role: string; content: string }) => ({
              [m.role]: m.content,
            }))
          ),
        },
      ],
      max_tokens: 150,
    });
    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    return NextResponse.json({
      roomInfo: {
        dimensions: parsed.dimensions ?? undefined,
        roomType: parsed.roomType ?? undefined,
        theme: parsed.theme ?? undefined,
        colors: Array.isArray(parsed.colors) ? parsed.colors : [],
        maxBudget: typeof parsed.maxBudget === "number" ? parsed.maxBudget : undefined,
      },
    });
  } catch {
    return NextResponse.json({ roomInfo: {} });
  }
}
