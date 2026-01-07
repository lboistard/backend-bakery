import "dotenv/config"
import { Context } from "hono"
import { AppEnv } from "../../config/bindings"
import { makeGoogleAuthUrlUseCase } from "../../features/auth/google/application/makeGoogleAuthUrl.usecase";
import { AppError } from "../../lib/errors";

const googleAuth = (c: Context<AppEnv>) => {  
  const state = crypto.randomUUID(); 

  if (!c.env.GOOGLE_CLIENT_ID || !c.env.GOOGLE_CALLBACK_URL) {
    throw new AppError({
      status: 500,
      code: "INTERNAL",
      message: "Google OAuth env not configured",
    });
  }

  const url = makeGoogleAuthUrlUseCase({
    clientId: c.env.GOOGLE_CLIENT_ID,
    redirectUri: c.env.GOOGLE_CALLBACK_URL,
    state,
    accessType: "online",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url
    },
  })
}

export { googleAuth }