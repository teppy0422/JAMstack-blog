import { prisma } from "./prisma";

export const blogPost = async (title: string, content: string) => {
  const createPost = await prisma.sampleBlog3.create({
    data: {
      title,
      content,
    },
  });
  return createPost;
};
