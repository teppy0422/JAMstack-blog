// import { TypingResult } from "@prisma/client";
// import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import Prisma from "../../../libs/prisma";

import { PrismaClient } from "@prisma/client";

const prisma = Prisma;

export default async function post(
  // req: NextApiRequest,
  // res: NextApiResponse<TypingResult[] | TypingResult>
  req,
  res
) {
  const post = await prisma.typingresults2.create({
    data: {
      user_id: String(req.body.userId),
      result: Number(req.body.result),
      course: String(req.body.course),
      name: String(req.body.name),
      image: String(req.body.image),
      time: Number(req.body.time),
      missed: Number(req.body.missed),
    },
  });
  await res.status(200).json(post); // idを含む保存したデータを返す
  console.log(post);

  // async () => {
  //   await prisma.$disconnect();
  //   console.log("$disconnect");
  // };
}
