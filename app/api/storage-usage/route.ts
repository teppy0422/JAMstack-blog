import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin権限でSupabaseクライアントを作成
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // バケット一覧を取得
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      return NextResponse.json(
        { error: "Failed to list buckets" },
        { status: 500 }
      );
    }

    console.log("バケット一覧:", buckets);

    let totalSize = 0;

    for (const bucket of buckets) {
      console.log(`バケット ${bucket.name} を処理中...`);
      const bucketSize = await calculateBucketSize(bucket.name);
      console.log(`バケット ${bucket.name} のサイズ: ${bucketSize} bytes`);
      totalSize += bucketSize;
    }

    console.log("合計サイズ:", totalSize, "bytes");

    return NextResponse.json({
      totalBytes: totalSize,
      totalGB: (totalSize / (1024 * 1024 * 1024)).toFixed(3),
      buckets: buckets.map((b) => b.name),
    });
  } catch (error: any) {
    console.error("Error fetching storage usage:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// バケットのサイズを計算（再帰的に全ファイルを取得）
async function calculateBucketSize(bucketName: string): Promise<number> {
  let totalSize = 0;

  const getFilesRecursively = async (path: string = "") => {
    const { data: files, error } = await supabaseAdmin.storage
      .from(bucketName)
      .list(path, {
        limit: 1000,
      });

    if (error) {
      console.error(`Error listing files in ${bucketName}/${path}:`, error);
      return;
    }

    if (files) {
      console.log(`フォルダ ${path || "/"} 内のファイル数: ${files.length}`);

      for (const file of files) {
        // ファイルの場合（idがある）
        if (file.id) {
          const size = file.metadata?.size || 0;
          console.log(`  - ${file.name}: ${size} bytes`);
          totalSize += size;
        }

        // フォルダの場合（idがnullでnameがある）
        if (!file.id && file.name) {
          const newPath = path ? `${path}/${file.name}` : file.name;
          await getFilesRecursively(newPath);
        }
      }
    }
  };

  await getFilesRecursively();
  return totalSize;
}
