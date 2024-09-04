import { config } from "dotenv";
config({ path: process.env.NODE_ENV === "production" ? ".env" : ".env.local" });

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import app from "./src/lib/slackBot";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  // Start the Slack bot
  (async () => {
    await app.start();
    console.log("⚡️ Bolt app is running!");
  })();
});
