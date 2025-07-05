// app/api/status/route.ts
import { NextResponse } from "next/server";

const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY!;

export async function GET() {
  const now = new Date();
  const timeMin = new Date(now.getTime() - 1 * 60 * 1000).toISOString(); // 1分前から
  const timeMax = new Date(now.getTime() + 1 * 60 * 1000).toISOString(); // 1分後まで

  const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const isOnline = data.items?.some((event: any) => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      return start <= now && now <= end;
    });

    return NextResponse.json({ status: isOnline ? "online" : "offline" });
  } catch (err) {
    console.error("Failed to check calendar status:", err);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
