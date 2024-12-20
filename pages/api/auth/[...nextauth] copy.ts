import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import LineProvider from "next-auth/providers/line";
import { signIn } from "next-auth/react";

// データベーステスト
// prisma adaptor 使って、user データ、認証データを永続化する
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// envファイルの読み込みを確認
const {
  NEXT_PUBLIC_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  LINE_CLIENT_ID,
  LINE_CLIENT_SECRET,
} = process.env;

if (!NEXT_PUBLIC_SECRET)
  throw new Error("You must provide NEXT_PUBLIC_SECRET env var.");
if (!GOOGLE_CLIENT_ID)
  throw new Error("You must provide GOOGLE_CLIENT_ID env var.");
if (!GOOGLE_CLIENT_SECRET)
  throw new Error("You must provide GOOGLE_CLIENT_SECRET env var.");
if (!LINE_CLIENT_ID)
  throw new Error("You must provide LINE_CLIENT_ID env var.");
if (!LINE_CLIENT_SECRET)
  throw new Error("You must provide LINE_CLIENT_SECRET env var.");

export default (req: NextApiRequest, res: NextApiResponse): void =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      // TwitterProvider({
      //   clientId: process.env.TWITTER_CLIENT_ID,
      //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
      // }),
      LineProvider({
        clientId: LINE_CLIENT_ID,
        clientSecret: LINE_CLIENT_SECRET,
      }),
    ],
    theme: {
      colorScheme: "light",
    },
    // ログイン情報を保存してくれる
    adapter: PrismaAdapter(prisma),
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // console.log("[...nextauth].js > setting > callbacks > signIn");
        return true;
      },
      //
      async jwt({ token, user, account, profile, isNewUser }) {
        // console.log(`アカウント:${JSON.stringify(account)}`);
        if (account?.accessToken) {
          token.accessToken = account.accessToken;
        }
        console.log(token);
        return token;
      },

      // async session({ session, token, user }) {
      //   // Send properties to the client, like an access_token from a provider.
      //   session.accessToken = token.accessToken;
      //   return session;
      // },

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
    // session: {
    //   strategy: "database",
    //   maxAge: 30 * 24 * 60 * 60,//30日
    // },
    // pages: {
    //   signIn: "/login2",
    // },
    // events: {
    //   createUser: async ({ user }) => {
    //     await prisma.user.update({
    //       where: {
    //         id: user.id,
    //       },
    //       data: {
    //         mobile: "090-1111-1111",
    //       },
    //     });
    //   },
    // },
    // ここに NEXTAUTH_SECRET を入れる?
    secret: process.env.NEXT_PUBLIC_SECRET,
    debug: true,
  });
