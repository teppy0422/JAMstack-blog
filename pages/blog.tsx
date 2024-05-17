import React, { useRef } from "react";

const Blog = () => {
  const inputTitle = useRef<HTMLTextAreaElement>(null);
  const inputPost = useRef<HTMLTextAreaElement>(null);
  const handlePost = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const title = inputTitle.current?.value;
    const content = inputPost.current?.value;
    fetch("/api/create-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
  };
  return (
    <div className={"flex justify-center"}>
      <form>
        <div className={"flex flex-col justify-center items-center"}>
          <label htmlFor={"title"}></label>
          <textarea
            ref={inputTitle}
            className={
              "w-96 mt-16 mb-5 px-3 py-3  bg-gray-200 border rounded-lg text-lg text-gray-700 focus:outline-none rounded-2xl resize-none focus:border-blue-500 focus:shadow-outline"
            }
            placeholder={"タイトル"}
            spellCheck={false}
            id={"title"}
            autoComplete={"off"}
          />
          <label htmlFor={"body"}></label>
          <textarea
            ref={inputPost}
            className={
              "w-96 h-96 mt-5 mb-5 px-3 py-3  bg-gray-200 border rounded-lg text-lg text-gray-700 focus:outline-none rounded-2xl resize-none focus:border-blue-500 focus:shadow-outline"
            }
            placeholder={"記事"}
            spellCheck={false}
            id={"title"}
            autoComplete={"off"}
          />
        </div>
        <div className={"flex items-end"}>
          <button
            className="w-32 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={handlePost}
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
};

export default Blog;
