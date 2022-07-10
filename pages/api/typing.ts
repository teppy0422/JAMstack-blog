import { TypingResult } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TypingResult[] | TypingResult>
) {
  const { method } = req;

  console.log(method);
  console.log(req.body.result);

  switch (method) {
    case "GET":
      const authors = await prisma.typingResult.findMany();
      res.status(200).json(authors);
      break;

    case "POST":
      const author = await prisma.typingResult.create({
        data: {
          userId: req.body.userId,
          result: req.body.result,
          course: req.body.course,
          name: req.body.name,
          image: req.body.image,
          times: req.body.times,
        },
      });
      res.status(200).json(author); // idを含む保存したデータを返す
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
