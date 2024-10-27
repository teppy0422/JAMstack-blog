import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client-js";

interface UserData {
  user_mainCompany: string;
  userName: string;
}

const useFetchUserData = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.from("table_users").select("*");

      if (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } else {
        console.log("取得したデータtodo:", data);
        setUserData(data);
      }
    };
    fetchUserData();
  }, []);

  return { userData, error };
};

export default useFetchUserData;
