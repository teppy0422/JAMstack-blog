import React, { useState, useEffect } from "react";
import { getAllposts } from "../utils/supabaseFunctions";

export default function Todo() {
  const [todos, setTodos] = useState<any>([]);

  useEffect(() => {
    const getTodos = async () => {
      const todos = await getAllposts();
      setTodos(todos);
      console.log("todos", todos);
    };
    getTodos();
  }, []);
  return (
    <div>
      <h1>Todo</h1>
      <div>
        <h1>環境変数の確認</h1>
        <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_API_ANON_KEY}</p>
      </div>
      {todos && <div>{JSON.stringify(todos)}</div>}
    </div>
  );
}
