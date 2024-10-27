import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client-js";

interface Todo {
  id: number;
  userName: string;
  value: string;
  completed: boolean;
  userId: string;
  user_mainCompany: string;
  user_company: string;
}

const useFetchTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("todo_chat").select("*");

      if (error) {
        console.error("Error fetching todos:", error);
        setError(error.message);
      } else {
        // 並び替えたtodosを設定
        const sortedData = data.sort((a: Todo, b: Todo) => {
          const mainCompanyComparison = a.user_mainCompany.localeCompare(
            b.user_mainCompany
          );
          if (mainCompanyComparison !== 0) return mainCompanyComparison;

          const companyComparison = (a.user_company || "").localeCompare(
            b.user_company || ""
          );
          if (companyComparison !== 0) return companyComparison;

          return (a.userName || "").localeCompare(b.userName || "");
        });

        setTodos(sortedData);
      }
    };

    fetchTodos();
  }, []);

  return { todos, error };
};

export default useFetchTodos;
