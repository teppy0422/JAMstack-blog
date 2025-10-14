// app/api/calendar/events/route.ts
import { NextRequest, NextResponse } from "next/server";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeMin = searchParams.get("timeMin");
    const timeMax = searchParams.get("timeMax");

    if (!timeMin || !timeMax) {
      return NextResponse.json(
        { error: "timeMin and timeMax are required" },
        { status: 400 }
      );
    }

    if (!CALENDAR_ID || !API_KEY) {
      console.error("Missing environment variables:", {
        hasCalendarId: !!CALENDAR_ID,
        hasApiKey: !!API_KEY,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Google Calendar API error:", data);
      return NextResponse.json(
        { error: "Failed to fetch calendar events", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ items: data.items || [] });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
