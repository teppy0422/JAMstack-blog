import { TypingResult } from "@prisma/client";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import Prisma from "../../libs/prisma";

import { PrismaClient } from "@prisma/client";

const prisma = Prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TypingResult[] | TypingResult>
  // req,
  // res
) {
  const { method } = req;
  console.log({ method });

  switch (method) {
    case "GET":
      const authors = await prisma.typingResult.findMany();
      res.status(200).json(authors);
      break;

    case "POST":
      type Request = {
        userId: string;
        result: number;
        course: string;
        name: string;
        image: string;
        times: number;
        missed: number;
      };
      const { userId, result, course, name, image, times, missed } =
        req.body as Request;
      const post = await prisma.typingResult.create({
        data: {
          userId: userId,
          result: result,
          course: course,
          name: name,
          image: image,
          times: times,
          missed: missed,
        },
      });
      await res.status(200).json(post); // idを含む保存したデータを返す
      console.log(post);
      break;

    case "DELETE":
      console.log("delete:", req.body.delete_id);
      const delete_result = await prisma.typingResult.delete({
        where: {
          id: Number(req.body.delete_id),
        },
      });
      res.status(200).json(delete_result); // idを含む保存したデータを返す
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  // async () => {
  //   await prisma.$disconnect();
  //   console.log("$disconnect");
  // };
}
