import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function mapBoard(b: {
  id: string;
  name: string;
  room_info: object;
  products: unknown[];
  total_cost: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  shared_by_email?: string;
}) {
  return {
    id: b.id,
    name: b.name,
    roomInfo: b.room_info ?? {},
    products: b.products ?? [],
    totalCost: b.total_cost ?? 0,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
    userId: b.user_id,
    sharedByEmail: b.shared_by_email,
  };
}

export async function GET() {
  if (!supabaseConfigured) {
    return NextResponse.json({ boards: [] });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ boards: [] });
    }

    // Fetch own boards
    const { data: ownBoards, error: ownError } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (ownError) throw ownError;

    // Fetch boards shared with the current user's email
    const { data: shares } = await supabase
      .from("board_shares")
      .select("board_id")
      .eq("shared_with_email", user.email);

    let sharedBoards: ReturnType<typeof mapBoard>[] = [];
    if (shares && shares.length > 0) {
      const sharedIds = (shares as Array<{ board_id: string }>).map((s) => s.board_id);
      const { data: shared } = await supabase
        .from("boards")
        .select("*")
        .in("id", sharedIds)
        .order("updated_at", { ascending: false });

      if (shared) {
        sharedBoards = shared.map((b) => ({
          ...mapBoard(b),
          sharedByEmail: "a roommate",
        }));
      }
    }

    const allBoards = [...(ownBoards ?? []).map(mapBoard), ...sharedBoards];
    return NextResponse.json({ boards: allBoards });
  } catch {
    return NextResponse.json({ boards: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase not configured. Use localStorage." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();

    const { data, error } = await supabase
      .from("boards")
      .insert({
        name: body.name ?? "Untitled Board",
        room_info: body.roomInfo ?? {},
        products: body.products ?? [],
        total_cost: body.totalCost ?? 0,
        user_id: user?.id ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save board" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!supabaseConfigured) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing board id" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("boards")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!supabaseConfigured) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.from("boards").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete board" }, { status: 500 });
  }
}
