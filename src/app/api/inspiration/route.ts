import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "room decor aesthetic";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = 24;

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ photos: [], total_pages: 0, error: "no_key" });
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=squarish`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return NextResponse.json({ photos: [], total_pages: 0 });
    }
    const data = await res.json();
    const photos = (data.results ?? []).map((p: {
      id: string;
      urls: { regular: string; small: string };
      alt_description: string | null;
      description: string | null;
      user: { name: string; links: { html: string } };
      links: { html: string };
    }) => ({
      id: p.id,
      url: p.urls.small,
      full_url: p.urls.regular,
      alt: p.alt_description ?? p.description ?? query,
      photographer: p.user.name,
      photographer_link: p.user.links.html,
      unsplash_link: p.links.html,
    }));
    return NextResponse.json({ photos, total_pages: data.total_pages ?? 1 });
  } catch {
    return NextResponse.json({ photos: [], total_pages: 0 });
  }
}
