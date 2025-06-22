"use client";

// context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/utils/supabase/client";

export interface UserData {
  id: string;
  picture_url: string | undefined;
  user_metadata: {
    name: string;
  };
  user_company: string | null;
  user_mainCompany: string | null;
  created_at: string | null;
  is_email_active?: boolean | undefined;
  is_email_notify?: boolean | undefined;
  last_notified_at?: string | null;
  email?: string | null;
}
interface AuthUserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  user_metadata: any;
}
interface UserContextType {
  // 現在のユーザー情報
  currentUserId: string | null;
  currentUserPictureUrl: string | undefined;
  currentUserName: string | null;
  currentUserCompany: string | null;
  currentUserMainCompany: string | null;
  currentUserEmail: string | null;
  currentUserCreatedAt: string | null;
  currentUserIsEmailActive?: boolean | undefined;
  currentUserIsEmailNotify?: boolean | undefined;
  currentLastNotifiedAt?: boolean | null;
  // ユーザー検索機能
  getUserById: (id: string | null) => UserData | null;
  updateUserById: (id: string, updates: Partial<UserData>) => void;
  refreshUsers: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // 現在のユーザー情報のステート
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserPictureUrl, setCurrentUserPictureUrl] = useState<
    string | undefined
  >(undefined);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserCompany, setCurrentUserCompany] = useState<string | null>(
    null
  );
  const [currentUserMainCompany, setCurrentUserMainCompany] = useState<
    string | null
  >(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserCreatedAt, setCurrentUserCreatedAt] = useState<
    string | null
  >(null);
  const [currentUserIsEmailActive, setCurrentUserIsEmailActive] = useState<
    boolean | undefined
  >(false);
  const [currentUserIsEmailNotify, setCurrentUserIsEmailNotify] = useState<
    boolean | undefined
  >(false);
  const [currentLastNotifiedAt, setCurrentLastNotifiedAt] = useState<
    string | null | undefined
  >(null);

  // 全ユーザー情報のステート
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase.from("table_users").select("*");
      if (error) {
        console.error("Error fetching all users:", error.message);
        return;
      }
      setAllUsers(data || []);
    } catch (error) {
      console.error("Error in fetchAllUsers:", error);
    }
  };

  // 現在のユーザーIDを取得する関数
  const fetchCurrentUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { email } = user;
      setCurrentUserEmail(email || null);
      return user.id;
    }
    return null;
  };

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        // 現在のユーザーIDを取得
        const userId = await fetchCurrentUserId();
        // 全ユーザー情報を取得
        await fetchAllUsers();
      } catch (error) {
        console.error("Error in initializeUser:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeUser();
  }, []);

  // allUsersが更新された後にユーザー情報を設定
  useEffect(() => {
    if (currentUserId && allUsers.length > 0) {
      const userData = getUserById(currentUserId);
      if (userData) {
        console.log("Setting user data:", userData);
        setCurrentUserPictureUrl(userData.picture_url);
        setCurrentUserName(userData.user_metadata.name);
        setCurrentUserCompany(userData.user_company);
        setCurrentUserMainCompany(userData.user_mainCompany);
        setCurrentUserCreatedAt(userData.created_at);
        setCurrentUserIsEmailActive(userData.is_email_active);
        setCurrentUserIsEmailNotify(userData.is_email_notify);
        setCurrentLastNotifiedAt(userData.last_notified_at);
      } else {
        // console.log("No user data found for ID:", currentUserId);
      }
    }
  }, [allUsers, currentUserId]);

  const getUserById = (id: string): UserData | null => {
    return allUsers.find((user) => user.id === id) || null;
  };

  const updateUserById = (id, updates) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const refreshUsers = async () => {
    setIsLoading(true);
    await fetchAllUsers();
    setIsLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        // 現在のユーザー情報
        currentUserId,
        currentUserPictureUrl,
        currentUserName,
        currentUserCompany,
        currentUserMainCompany,
        currentUserEmail,
        currentUserCreatedAt,
        currentUserIsEmailActive,
        currentUserIsEmailNotify,
        // ユーザー検索機能
        getUserById,
        updateUserById,
        refreshUsers,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
