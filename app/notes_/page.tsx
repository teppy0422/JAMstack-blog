import React from "react";
import { createClient } from "../../utils/supabase/server";

export default async function Notes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();

  return <>{notes && notes.map((note) => <p key={note.id}>{note.title}</p>)}</>;
}
