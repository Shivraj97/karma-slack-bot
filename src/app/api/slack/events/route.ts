import { NextRequest, NextResponse } from "next/server";
import app, { handleAppMention } from "@/lib/slackBot";
import clientPromise from "@/lib/mongodb";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  if (body.event) {
    try {
      const db = await getDb();
      // Log the raw event to the database
      await db.collection("raw_events").insertOne({
        type: body.event.type,
        data: body,
        timestamp: new Date(),
      });

      // Handle different event types
      switch (body.event.type) {
        case "app_mention":
          await handleAppMention(body.event);
          break;
        // Add more event types as needed
      }
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
