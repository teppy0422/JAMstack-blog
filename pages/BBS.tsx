import React, { useState, useEffect } from "react";

export default async function HOME() {
  const response = await fetch("http://localhost:3000/api/BBSpost", {
    cache: "no-store",
  });
  const bbsAllData = await response.json();
  console.log(bbsAllData);

  return (
    <div>
      <h1>掲示板</h1>
    </div>
  );
}
