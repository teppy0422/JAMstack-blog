import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 書き込み権限あり
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ym, app, action, ip } = body;

    if (!ym || !app || !action || !ip) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("usage_log_summary")
      .upsert(
        { ym, app, action, ip, count: 1 },
        { onConflict: "ym,app,action,ip" }
      );
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
