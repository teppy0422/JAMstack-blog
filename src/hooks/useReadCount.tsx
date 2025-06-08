import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

export const useReadCount = (userId: string | null) => {
  const [readByCount, setReadByCount] = useState(0);
  const [skillBlogsData, setSkillBlogsData] = useState<
    { url: string; readBy: string[] }[]
  >([]);

  const fetchSkillBlogsData = useCallback(async () => {
    const { data, error } = await supabase
      .from("skillBlogs")
      .select("url, readBy");
    if (!error) setSkillBlogsData(data || []);
  }, []);

  const fetchReadCount = useCallback(async () => {
    const currentUrl = window.location.href;
    const urlWithoutHash = currentUrl.split("#")[0];
    const trimmedUrl = urlWithoutHash.endsWith("/")
      ? urlWithoutHash.slice(0, -1)
      : urlWithoutHash;
    const lastSegment = trimmedUrl.split("/").pop();
    const { data } = await supabase
      .from("skillBlogs")
      .select("readBy")
      .eq("url", lastSegment)
      .single();
    setReadByCount(data?.readBy?.length || 0);
  }, []);

  useEffect(() => {
    let hasInserted = false;

    const handleScroll = async () => {
      if (userId === null) {
        console.log("userId is null");
        return;
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        const currentUrl = window.location.href;
        const urlWithoutHash = currentUrl.split("#")[0];
        const trimmedUrl = urlWithoutHash.endsWith("/")
          ? urlWithoutHash.slice(0, -1)
          : urlWithoutHash;
        const lastSegment = trimmedUrl.split("/").pop();
        console.log(lastSegment);

        const { data, error } = await supabase
          .from("skillBlogs")
          .select("readBy")
          .eq("url", lastSegment)
          .single();
        console.log(data);
        if (error) {
          console.error("Error fetching data:", error);
        }
        if (data) {
          if (!data.readBy || !data.readBy.includes(userId)) {
            const updatedReadBy = data.readBy
              ? [...data.readBy, userId]
              : [userId];
            await supabase
              .from("skillBlogs")
              .update({ readBy: updatedReadBy })
              .eq("url", lastSegment);
          }
        } else if (!hasInserted) {
          await supabase
            .from("skillBlogs")
            .insert([{ url: lastSegment, readBy: [userId] }]);
          hasInserted = true;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [userId]);
  // 外部から呼べるリフレッシュ関数
  const refresh = useCallback(() => {
    fetchSkillBlogsData();
    fetchReadCount();
  }, [fetchSkillBlogsData, fetchReadCount]);

  // 外部から呼べるインサート関数
  const insertOrUpdate = useCallback(
    async (url: string, userId: string | null) => {
      // 既存データを取得
      const { data, error } = await supabase
        .from("skillBlogs")
        .select("readBy")
        .eq("url", url)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116: No rows found
        console.error("Error fetching skillBlogs:", error);
        return;
      }

      if (data) {
        // 既存のreadByにuserIdがなければ追加
        if (!data.readBy.includes(userId)) {
          const updatedReadBy = [...data.readBy, userId];
          await supabase
            .from("skillBlogs")
            .update({ readBy: updatedReadBy })
            .eq("url", url);
        }
      } else {
        // 存在しなければ新規insert
        await supabase
          .from("skillBlogs")
          .insert([{ url: url, readBy: [userId] }]);
      }
    },
    []
  );

  return { readByCount, skillBlogsData, refresh, insertOrUpdate };
};
