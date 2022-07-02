import type { NextApiRequest, NextApiResponse } from "next";
import { blogPost } from "../../libs/typingPost";

interface BlogsNextApiRequest extends NextApiRequest {
  body: {
    result: number;
    course: string;
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

  const result = req.body.result;
  const course = req.body.course;

  console.log("body", result, course);
  if (result != null && course != null) {
    blogPost(result, course)
      .then((createdPost) => {
        console.log(
          `ID:${createdPost.id} | ${createdPost.result} を作成しました。`
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
  res.status(200).json({ name: "サンプルの投稿が完了" });
}
