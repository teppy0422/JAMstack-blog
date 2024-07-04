import { supabase } from "./supabase";

export const getAllposts = async () => {
  let { data, error } = await supabase.from("Post").select("*");
  if (error) {
    console.error("取得できませんでした:", error.message, error.details);
    return null;
  }
  return data;
};
