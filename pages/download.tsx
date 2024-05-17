import React from "react";
import Link from "next/link";

const DownloadPage = () => {
  return (
    <div>
      <h1>ダウンロード</h1>
      <Link href="/files/downloadTxt.txt" passHref>
        <a download="downloadTxt.txt">こちらからダウンロード</a>
      </Link>
    </div>
  );
};

export default DownloadPage;
