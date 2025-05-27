export const getIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch("/api/ip");
    const data = await response.json();
    return data.ip || "";
  } catch (error) {
    console.error("IPアドレス取得エラー:", error);
    return "";
  }
};
