// app/api/vba/log-error/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const data = await req.json();

  const { fullname, project, ver, ip, err, description, procedure, line } =
    data;

  const { error } = await supabaseAdmin.from("error_logs").insert([
    {
      fullname,
      project,
      ver,
      ip,
      err,
      description,
      procedure,
      line,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
