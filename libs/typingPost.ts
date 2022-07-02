import { prisma } from "./prisma";

export const blogPost = async (result: number, course: string) => {
  const userId = "tempuser";
  const createPost = await prisma.typingResult.create({
    data: {
      // userId,
      result,
      course,
    },
  });
  return createPost;
};
