// app/api/log-error/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(req: Request) {
  const data = await req.json();

  const { fullname, project, ver, ip, err, description, procedure, line } =
    data;

  const { error } = await supabase.from("error_logs").insert([
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
