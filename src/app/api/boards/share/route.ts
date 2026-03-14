import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { boardId, sharedWithEmail } = await req.json();

    if (!boardId || !sharedWithEmail) {
      return NextResponse.json(
        { error: "boardId and sharedWithEmail are required" },
        { status: 400 }
      );
    }

    // Verify the board belongs to the current user
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("id")
      .eq("id", boardId)
      .eq("user_id", user.id)
      .single();

    if (boardError || !board) {
      return NextResponse.json(
        { error: "Board not found or not owned by you" },
        { status: 404 }
      );
    }

    // Upsert the share (prevent duplicates)
    const { error } = await supabase.from("board_shares").upsert(
      {
        board_id: boardId,
        shared_with_email: sharedWithEmail.toLowerCase(),
        shared_by_user_id: user.id,
      },
      { onConflict: "board_id,shared_with_email" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Share error:", err);
    return NextResponse.json(
      { error: "Failed to share board" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");
    const email = searchParams.get("email");

    if (!boardId || !email) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    await supabase
      .from("board_shares")
      .delete()
      .eq("board_id", boardId)
      .eq("shared_with_email", email.toLowerCase())
      .eq("shared_by_user_id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove share" }, { status: 500 });
  }
}
