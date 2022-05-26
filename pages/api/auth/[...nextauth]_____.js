import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

if (!GOOGLE_ID) throw new Error("You must provide GOOGLE_ID env var.");
if (!GOOGLE_SECRET) throw new Error("You must provide GOOGLE_SECRET env var.");

export default NextAuth({
  providers: [
    Providers.google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
});
