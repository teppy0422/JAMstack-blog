import { prisma } from "./prisma";

export const blogPost = async (title: string, content: string) => {
  const createPost = await prisma.sampleBlog.create({
    data: {
      title,
      content,
    },
  });
  return createPost;
};
