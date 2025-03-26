import React, { createContext, useContext, useState } from "react";

type UnreadContextType = {
  unreadCountsByThread: Record<string, number>;
  setUnreadCountsByThread: (counts: Record<string, number>) => void;
  updateUnreadCount: (threadId: string, count: number) => void;
};

const UnreadContext = createContext<UnreadContextType | undefined>(undefined);

export function UnreadProvider({ children }: { children: React.ReactNode }) {
  const [unreadCountsByThread, setUnreadCountsByThread] = useState<
    Record<string, number>
  >({});

  const updateUnreadCount = (threadId: string, count: number) => {
    setUnreadCountsByThread((prev) => ({
      ...prev,
      [threadId]: count,
    }));
  };

  return (
    <UnreadContext.Provider
      value={{
        unreadCountsByThread,
        setUnreadCountsByThread,
        updateUnreadCount,
      }}
    >
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread() {
  const context = useContext(UnreadContext);
  if (context === undefined) {
    throw new Error("useUnread must be used within an UnreadProvider");
  }
  return context;
}
