import type { NextApiRequest, NextApiResponse } from "next";
import { blogPost } from "../../libs/blog-post";

interface BlogsNextApiRequest extends NextApiRequest {
  body: {
    title: string;
    content: string;
  };
}

export default function handler(
  req: BlogsNextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const title = req.body.title;
  const content = req.body.content;

  console.log("body", title, content);
  if (title != null && content != null) {
    blogPost(title, content)
      .then((createdPost) => {
        console.log(
          `ID:${createdPost.id} | ${createdPost.title} を作成しました。`
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
  res.status(200).json({ name: "サンプルの投稿が完了" });
}
