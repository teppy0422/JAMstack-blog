// app/api/calendarStatus/route.ts
import { NextRequest, NextResponse } from "next/server";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY!;

// キャッシュ用の変数
let cachedEvents: any[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30分（ミリ秒）

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("mode"); // "current" or "weekly"
    const userId = searchParams.get("userId");
    const targetDate = searchParams.get("targetDate");

    if (!CALENDAR_ID || !API_KEY) {
      console.error("Missing environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const now = new Date();

    // 週間スケジュール取得モード
    if (mode === "weekly" && targetDate) {
      const selectedDate = new Date(targetDate);
      const firstDayOfWeek = new Date(selectedDate);
      const lastDayOfWeek = new Date(selectedDate);

      // 月曜日を計算
      firstDayOfWeek.setDate(
        selectedDate.getDate() -
          (selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 0)
      );
      firstDayOfWeek.setHours(0, 0, 0, 0);

      // 日曜日を計算
      lastDayOfWeek.setDate(
        selectedDate.getDate() +
          (selectedDate.getDay() === 0 ? 0 : 7 - selectedDate.getDay())
      );
      lastDayOfWeek.setHours(23, 59, 59, 999);

      const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${firstDayOfWeek.toISOString()}&timeMax=${lastDayOfWeek.toISOString()}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error("Google Calendar API error:", data);
        return NextResponse.json(
          { error: "Failed to fetch calendar events", details: data },
          { status: response.status }
        );
      }

      // イベントをフィルタリングして整形
      const schedules = (data.items || [])
        .filter((event: any) => {
          // userIdが指定されている場合、イベントの説明にuserIdが含まれているかチェック
          if (userId && event.description) {
            return event.description.includes(userId);
          }
          return true;
        })
        .map((event: any) => ({
          startTime: event.start.dateTime || event.start.date,
          endTime: event.end.dateTime || event.end.date,
          activity: extractActivityFromEvent(event),
          note: event.summary || "",
          project: extractProjectFromEvent(event),
        }));

      return NextResponse.json({ schedules });
    }

    // 現在のステータス取得モード
    // キャッシュの有効性をチェック
    const currentTime = Date.now();
    const isCacheValid =
      cachedEvents !== null &&
      cacheTimestamp !== null &&
      (currentTime - cacheTimestamp) < CACHE_DURATION;

    let events: any[];

    if (isCacheValid) {
      console.log("Using cached events");
      events = cachedEvents!;
    } else {
      console.log("Fetching fresh events from Google Calendar API");
      // 今日の開始時刻（0時）から翌日の開始時刻（0時）まで取得
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);

      const timeMin = todayStart.toISOString();
      const timeMax = todayEnd.toISOString();

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

      // キャッシュを更新
      events = data.items || [];
      cachedEvents = events;
      cacheTimestamp = currentTime;
      console.log(`Cached ${events.length} events at ${new Date(cacheTimestamp).toISOString()}`);
    }

    // ユーザーごとのステータスを集計
    const userStatuses: { [key: string]: any } = {};

    console.log("Current time (server):", now.toISOString());
    console.log("Current time (JST):", new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })));
    console.log("Total events:", events.length);

    // デフォルトユーザーID（userIdが指定されていない場合に使用）
    const defaultUserId = "calendar_user";
    let hasCurrentEvent = false;

    events.forEach((event: any) => {
      const start = new Date(event.start.dateTime || event.start.date);
      const end = new Date(event.end.dateTime || event.end.date);
      const isCurrent = start <= now && now <= end;

      console.log("Event:", event.summary);
      console.log("  Start:", start.toISOString(), "JST:", new Date(start.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })));
      console.log("  End:", end.toISOString(), "JST:", new Date(end.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })));
      console.log("  isCurrent:", isCurrent, "start <= now:", start <= now, "now <= end:", now <= end);

      // イベントの説明からuserIdを抽出（任意）
      const eventUserId = extractUserIdFromEvent(event) || defaultUserId;
      console.log("  UserId:", eventUserId);

      if (isCurrent) {
        hasCurrentEvent = true;
        userStatuses[eventUserId] = {
          activity: extractActivityFromEvent(event),
          note: event.summary || "",
          startTime: event.start.dateTime || event.start.date,
          endTime: event.end.dateTime || event.end.date,
          user_id: eventUserId,
          project: extractProjectFromEvent(event),
        };
        console.log("  -> Set as ONLINE");
      }
    });

    // 現在のイベントがない場合、デフォルトユーザーをオフラインに設定
    if (!hasCurrentEvent) {
      userStatuses[defaultUserId] = {
        activity: "absent",
        note: "",
        startTime: "",
        endTime: "",
        user_id: defaultUserId,
        project: "",
      };
      console.log("No current events -> Set default user as OFFLINE");
    }

    return NextResponse.json({ userStatuses });
  } catch (err) {
    console.error("Failed to check calendar status:", err);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}

// イベントからuserIdを抽出する関数
function extractUserIdFromEvent(event: any): string | null {
  if (!event.description) return null;
  const match = event.description.match(/userId:\s*(\S+)/);
  return match ? match[1] : null;
}

// イベントからactivityを抽出する関数
function extractActivityFromEvent(event: any): string {
  // 1. descriptionから activity を抽出（優先）
  if (event.description) {
    const match = event.description.match(/activity:\s*(\S+)/);
    if (match) return match[1];
  }

  // 2. イベントタイトル（summary）から自動判定
  const summary = event.summary || "";
  if (summary.includes("訪問")) return "visiting";
  if (summary.includes("コーディング") || summary.includes("開発")) return "coding";
  if (summary.includes("会議") || summary.includes("ミーティング")) return "meeting";
  if (summary.includes("就寝") || summary.includes("睡眠")) return "sleeping";

  // 3. デフォルト
  return "online";
}

// イベントからprojectを抽出する関数
function extractProjectFromEvent(event: any): string {
  if (!event.description) return "";
  const match = event.description.match(/project:\s*(.+?)(\n|$)/);
  return match ? match[1].trim() : "";
}
