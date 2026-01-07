import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  
  MONGO_URI: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string(),
  FRONTEND_URL: z.string().optional(),
});

export type AppConfig = z.infer<typeof EnvSchema>;

export const loadConfig = (): AppConfig => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    
    console.error(parsed.error);
    process.exit(1);
  }
  
  const config = parsed.data;
  
  if (!config.MONGO_URI) {
    console.error("MongoDB configuration error:");
    process.exit(1);
  }
  
  return config;
}