import type { Context } from "hono";
import { AppEnv } from "../../config/bindings";

const getUserProfile = async (c: Context<AppEnv>) => {
  const user = c.get("user");
  
  if (!user) {
    throw new Error("User not found in context");
  }
  
  return c.json({
    id: user._id.toString(),
    email: user.email ?? null,
    name: user.name ?? null,
    picture: user.picture ?? null,
  });
};

export { getUserProfile };
