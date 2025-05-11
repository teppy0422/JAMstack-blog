// app/providers.jsx
"use client";

import { myContext } from "../context/DataContext";

export function Providers({ children }) {
  return (
    <myContext.Provider value={{ colorMode: "light" }}>
      {children}
    </myContext.Provider>
  );
}
