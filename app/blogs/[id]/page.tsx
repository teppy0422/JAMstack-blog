import { notFound } from "next/navigation";
import { client } from "@/utils/microcms/client";
import BlogContent from "./client";

export async function generateStaticParams() {
  const data = await client.get({
    endpoint: "blog",
    queries: { limit: 30 },
  });

  return data.contents.map((content: any) => ({
    id: content.id,
  }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let blog;

  try {
    blog = await client.get({
      endpoint: "blog",
      contentId: params.id,
    });
  } catch (e) {
    return notFound();
  }

  return <BlogContent blog={blog} />;
}
