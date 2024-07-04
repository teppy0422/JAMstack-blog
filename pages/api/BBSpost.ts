import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import prisma from "../../libs/prismaClient";

export async function GEt(req: Request) {
  const allBBSposts = await prisma.post.findMany();
  return NextResponse.json(allBBSposts);
}
