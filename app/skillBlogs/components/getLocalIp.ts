// components/getLocalIp.ts
export const getLocalIp = (userCompany: string | null): string => {
  if (userCompany === "高知") {
    return "10.7.140";
  } else if (userCompany === "徳島") {
    return "10.7.120";
  } else if (userCompany === "開発") {
    return "192.168.11";
  } else {
    return "不明";
  }
};
