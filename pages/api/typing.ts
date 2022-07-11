import { TypingResult } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  console.log({ method });

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
          missed: req.body.missed,
        },
      });
      res.status(200).json(author); // idを含む保存したデータを返す
      break;

    case "DELETE":
      console.log("delete:", req.body.delete_id);
      const delete_result = await prisma.typingResult.delete({
        where: {
          id: Number(req.body.delete_id),
        },
      });
      console.log("typing_delete_id");
      res.status(200).json(delete_result); // idを含む保存したデータを返す
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE_ID"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
