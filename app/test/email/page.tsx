import { Box } from "@chakra-ui/react";
import { bbsNotifEmailHtml } from "@/lib/templates/bbsNotifEmailHtml"; // fsを使う関数

export default function EmailPreviewPage() {
  const html = bbsNotifEmailHtml({
    threadTitle:
      "誘導ポイント設定一覧表からYICへの書き込みいいいいいいいいいいい",
    inputValue:
      "メッセージ内容あああああああああああああああああああああああああああああああ",
    threadUrl: "https://teppy.link/bbs",
    senderAvatarUrl:
      "https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp",
  });

  return (
    <Box p={6}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Box>
  );
}
