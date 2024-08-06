import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Error exchanging code for session:", error.message);
    return res.status(500).json({ error: error.message });
  }
  res.redirect("/");
}
