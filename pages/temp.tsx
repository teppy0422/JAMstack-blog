import { useEffect, useState } from "react";
import TodoList from "./TodoList";

export default function () {
  const [todoList, setTodoList] = useState<JSX.Element | null>(null);

  useEffect(() => {
    TodoList().then(setTodoList);
  }, []);

  return (
    <>
      <h1>TODO LIST</h1>
      <div>{todoList}</div>
    </>
  );
}
