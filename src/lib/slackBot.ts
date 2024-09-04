import { App, LogLevel } from "@slack/bolt";
import { getDb } from "./db";

console.log("Environment variables:", {
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
});

if (!process.env.SLACK_BOT_TOKEN) throw new Error("Missing SLACK_BOT_TOKEN");
if (!process.env.SLACK_SIGNING_SECRET)
  throw new Error("Missing SLACK_SIGNING_SECRET");
if (!process.env.SLACK_APP_TOKEN) throw new Error("Missing SLACK_APP_TOKEN");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // socketMode: true,
  // appToken: process.env.SLACK_APP_TOKEN,
  // logLevel: LogLevel.DEBUG,
});

// Listen for app mentions
app.event("app_mention", async ({ event, say }) => {
  console.log("Received app_mention event:", event);

  if (event.text.toLowerCase().includes("hi")) {
    try {
      const db = await getDb();
      // Example: Log the interaction to the database
      await db.collection("interactions").insertOne({
        type: "greeting",
        user: event.user,
        timestamp: new Date(),
      });

      await say({
        text: `Hello there, <@${event.user}>! How can I help you today?`,
        thread_ts: event.ts,
      });
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
});

app.processEvent = async (body: any) => {
  await app.processEvent(body);
};

export async function handleAppMention(event: any) {
  console.log("Handling app_mention event:", event);

  if (event.text.toLowerCase().includes("hi")) {
    try {
      const db = await getDb();
      await db.collection("interactions").insertOne({
        type: "greeting",
        user: event.user,
        timestamp: new Date(),
      });

      await app.client.chat.postMessage({
        channel: event.channel,
        text: `Hello there, <@${event.user}>! How can I help you today?`,
        thread_ts: event.ts,
      });
    } catch (error) {
      console.error("Error processing event:", error);
    }
  }
}

export default app;
