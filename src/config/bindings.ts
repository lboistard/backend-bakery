import type { AppConfig } from "./env";
import type { User } from "../models/user";

export type AppEnv = {
  Bindings: AppConfig;
  Variables: {
    user?: User;
  };
};