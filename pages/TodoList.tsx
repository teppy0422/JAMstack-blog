import { createClient } from "@supabase/supabase-js";

export default async function TodoList() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data: todos } = await supabase.from("todos").select();

  return <pre>{JSON.stringify(todos, null, 2)}</pre>;
}
