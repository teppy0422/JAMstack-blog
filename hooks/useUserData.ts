import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export const useUserData = (userId: string | null) => {
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<string | null>(null);
  const [userMainCompany, setUserMainCompany] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userData = await fetchUserFromTable(userId);
        if (userData) {
          setPictureUrl(userData.picture_url);
          setUserName(userData.user_metadata.name);
          setUserCompany(userData.user_company);
          setUserMainCompany(userData.user_mainCompany);
        } else {
          setPictureUrl(null);
          setUserName(null);
          setUserCompany(null);
          setUserMainCompany(null);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const fetchUserFromTable = async (userId: string) => {
    const { data, error } = await supabase
      .from("table_users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
    return data;
  };

  return { pictureUrl, userName, userCompany, userMainCompany };
};
