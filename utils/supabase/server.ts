import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./client";

export function createClient() {
  const cookieStore = cookies();

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        "x-my-custom-header": "my-custom-value",
      },
    },
    auth: {
      storage: {
        getItem: (key: string) => cookieStore.get(key)?.value ?? null,
        setItem: (key: string, value: string) => {
          cookieStore.set({ name: key, value });
        },
        removeItem: (key: string) => {
          cookieStore.set({ name: key, value: "" });
        },
      },
    },
  });
}
