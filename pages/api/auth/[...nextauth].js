import axios from "axios";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

// prisma adaptor 使って、user データ、認証データを永続化する
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

const { GOOGLE_ID, GOOGLE_SECRET, NEXTAUTH_SECRET } = process.env;
if (!GOOGLE_ID) throw new Error("You must provide GOOGLE_ID env var.");
if (!GOOGLE_SECRET) throw new Error("You must provide GOOGLE_SECRET env var.");

const setting = {
  // adapter: PrismaAdapter(prisma),
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
