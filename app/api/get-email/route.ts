// app/api/get-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    console.log("✅ POST /api/get-email called");

    const { uid } = await req.json();
    console.log("▶ uid received:", uid);

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(uid);
    console.log("📨 Supabase getUserById result:", { data, error });

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: data.user.email });
  } catch (e: any) {
    console.error("❌ Error in POST /api/get-email:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
