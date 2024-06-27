import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const allBBSposts = await prisma.post.findMany();
      res.status(200).json(allBBSposts);
    } catch (error) {
      console.error("Request error", error);
      res
        .status(500)
        .json({ error: "記事データの取得中にエラーが発生しました。BBSpost" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
