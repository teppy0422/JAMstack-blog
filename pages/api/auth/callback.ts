import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Callback request received");
  const code = req.query.code as string;
  if (!code) {
    console.error("No code provided");
    return res.status(400).json({ error: "No code provided" });
  }

  console.log("Code received:", code);

  try {
    console.log("Attempting to exchange code for session...");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("Exchange response:", { data, error });
    if (error) {
      console.error("Error exchanging code for session:", error);
      return res.status(500).json({ error: error.message });
    }
    console.log("Session exchange successful:", data);
    res.redirect("/");
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error", details: err });
  }
}
