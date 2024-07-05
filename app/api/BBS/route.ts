import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();

  return NextResponse.json(notes);
}
