import React, { useState, useEffect } from "react";

export default function HOME() {
  const [bbsData, setBbsData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000/api/BBSpost", {
        cache: "no-store",
      });
      const data = await response.json();
      setBbsData(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>掲示板</h1>
      {bbsData && <div>{JSON.stringify(bbsData)}</div>}
    </div>
  );
}
