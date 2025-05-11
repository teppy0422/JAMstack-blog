import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client-js";

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
          const aCompany = a.user_mainCompany || "";
          const bCompany = b.user_mainCompany || "";
          const mainCompanyComparison = aCompany.localeCompare(bCompany);

          if (mainCompanyComparison !== 0) {
            return mainCompanyComparison;
          }

          // 他の比較ロジックがある場合はここに追加
          return 0;
        });

        setTodos(sortedData);
      }
    };

    fetchTodos();
  }, []);

  return { todos, error };
};

export default useFetchTodos;
