import React from "react";
import { GetServerSideProps } from "next";

type Props = {
  ip: string;
};

export default function Home({ ip }: Props) {
  return (
    <div>
      <h1>クライアントのIPアドレス</h1>
      <p>{ip}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const clientIp =
    context.req.headers["x-forwarded-for"] || context.req.socket.remoteAddress;

  // IPアドレスが10.7.x.xの範囲にあるかをチェック
  const isAllowed = /^10\.7\.\d{1,3}\.\d{1,3}$/.test(clientIp as string);

  if (!isAllowed) {
    return {
      redirect: {
        destination: "/not-allowed", // アクセス拒否ページ
        permanent: false,
      },
    };
  }

  return {
    props: {
      ip: clientIp || "",
    },
  };
};
