export async function getUserEmail(uid: string): Promise<string | null> {
  try {
    const res = await fetch("/api/get-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid }),
    });

    if (!res.ok) {
      console.error("Failed to fetch user email:", res.status);
      return null;
    }

    const data = await res.json();
    return data.email ?? null;
  } catch (error) {
    console.error("Error fetching user email:", error);
    return null;
  }
}
