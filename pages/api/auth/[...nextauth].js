import axios from "axios";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

// prisma adaptor 使って、user データ、認証データを永続化する
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

const { GOOGLE_ID, GOOGLE_SECRET, NEXT_PUBLIC_SECRET } = process.env;
// if (!GOOGLE_ID) throw new Error("You must provide GOOGLE_ID env var.");
// if (!GOOGLE_SECRET) throw new Error("You must provide GOOGLE_SECRET env var.");

const setting = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // emailのドメイン制限を入れたい場合は以下のcallbacksを入れてください
    // signIn: async (user, account, profile) => {
    //   if (
    //     account.provider === "google" &&
    //     profile.verified_email === true &&
    //     profile.email.endsWith("@example.com")
    //   ) {
    //     return Promise.resolve(true);
    //   } else {
    //     return Promise.resolve(false);
    //   }
    // },
  },
  // ここに NEXTAUTH_SECRET を入れる?
  secret: "2d2daf11b3de5310a99fd5b133e2a9482d82f8f347db0cccc12f27925094e688",
};

export default (req, res) => NextAuth(req, res, setting);
