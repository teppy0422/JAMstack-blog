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

    // まず既存レコードを確認
    const { data, error: selectError } = await supabase
      .from("usage_log_summary")
      .select("count")
      .eq("ym", ym)
      .eq("app", app)
      .eq("action", action)
      .eq("ip", ip)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (data) {
      // 存在すれば count を +1 で更新
      const { error: updateError } = await supabase
        .from("usage_log_summary")
        .update({ count: data.count + 1 })
        .eq("ym", ym)
        .eq("app", app)
        .eq("action", action)
        .eq("ip", ip);

      if (updateError) throw updateError;
    } else {
      // 存在しなければ挿入
      const { error: insertError } = await supabase
        .from("usage_log_summary")
        .insert({ ym, app, action, ip, count: 1 });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
