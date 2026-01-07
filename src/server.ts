import { serve } from "@hono/node-server"
import { createApp } from "./api/app"
import { cors } from "hono/cors"

import mongoose from "mongoose"
import { loadConfig } from "./config/env";
import "dotenv/config"

const config = loadConfig();

const uri = config.MONGO_URI!;
const app = createApp()

app.use("*",
  cors({
    origin: "", // custom to what you need
    allowHeaders: ["Content-Type", "Authorization", "X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
)

try {
  await mongoose.connect(uri);
  console.log("connected to database");
} catch (error) {
  console.error("failed to connect to database:", error);
  if (error instanceof Error) {
    console.error("Error details:", error.message);
  }
  process.exit(1);
}

const server = serve(
  { 
    fetch: (req: Request) => {
      return app.fetch(req, config);
    },
    port: 3000
  },
  (info) => console.log(`Server running on http://localhost:${info.port}`)
)

const gracefulShutdown = async () => {
  server.close()
  await mongoose.connection.close()
  process.exit(0)
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", () => {
  server.close(async (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    await mongoose.connection.close()
    process.exit(0)
  })
})