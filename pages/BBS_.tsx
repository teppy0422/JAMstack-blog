import { createClient } from "../utils/supabase/server";

export default async function Notes() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
      {JSON.stringify(notes, null, 2)}
    </div>
  );
}
