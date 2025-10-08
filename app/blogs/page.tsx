import { client } from "@/utils/microcms/client";
import ClientPage from "./client";

export const revalidate = 60;

export default async function Page() {
  const blogRes = await client.get({
    endpoint: "blog",
    queries: { limit: 30 },
  });
  const categoryRes = await client.get({ endpoint: "categories" });
  const tagRes = await client.get({ endpoint: "tags", queries: { limit: 30 } });

  return (
    <ClientPage
      blog={blogRes.contents}
      category={categoryRes.contents}
      tag={tagRes.contents}
    />
  );
}
