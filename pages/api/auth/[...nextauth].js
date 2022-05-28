import axios from "axios";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

const { GOOGLE_ID, GOOGLE_SECRET, NEXTAUTH_SECRET } = process.env;

if (!GOOGLE_ID) throw new Error("You must provide GOOGLE_ID env var.");
if (!GOOGLE_SECRET) throw new Error("You must provide GOOGLE_SECRET env var.");

const setting = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  callbacks: {},
  // ここに NEXTAUTH_SECRET を入れる?
  secret: NEXTAUTH_SECRET,
};

export default (req, res) => NextAuth(req, res, setting);
