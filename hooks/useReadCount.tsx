import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export const useReadCount = (userId: string | null) => {
  const [readByCount, setReadByCount] = useState(0);
  const [skillBlogsData, setSkillBlogsData] = useState<
    { url: string; readBy: string[] }[]
  >([]);

  useEffect(() => {
    const fetchSkillBlogsData = async () => {
      const { data, error } = await supabase
        .from("skillBlogs")
        .select("url, readBy");

      if (error) {
        console.error("Error fetching skillBlogs data:", error);
      } else {
        setSkillBlogsData(data || []);
      }
    };

    fetchSkillBlogsData();
  }, []);

  useEffect(() => {
    const fetchReadCount = async () => {
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
    };
    fetchReadCount();
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

  return { readByCount, skillBlogsData };
};
