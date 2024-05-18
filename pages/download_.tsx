import React from "react";
import Link from "next/link";

const DownloadPage = () => {
  return (
    <div>
      <h1>ダウンロード</h1>
      <Link href="/files/downloadTxt.txt" passHref>
        <a download="downloadTxt.txt">こちらからダウンロードaaa</a>
      </Link>
      <Link href="/files/Sjp3.004.62_464D_82161-6BN31㈹aテスト.zip" passHref>
        <a download="Sjp3.004.62_464D_82161-6BN31㈹aテスト.zip">
          こちらからダウンロードaaa
        </a>
      </Link>
    </div>
  );
};

export default DownloadPage;
