import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/utils/supabase/client";

interface DataContextType {
  data: any[];
  getDataById: (id: string) => any | null;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
  tableName: string;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  tableName,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        console.error(`Error fetching ${tableName} data:`, error);
        return;
      }

      setData(data || []);
    } catch (error) {
      console.error(`Error in fetchData for ${tableName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const getDataById = (id: string) => {
    return data.find((item) => item.id === id) || null;
  };

  const refreshData = async () => {
    setIsLoading(true);
    await fetchData();
  };

  return (
    <DataContext.Provider value={{ data, getDataById, refreshData, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
