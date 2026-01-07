import type { Context } from "hono";
import { AppEnv } from "../../config/bindings";
import { AppError } from "../../lib/errors";
import { googleCallbackUseCase } from "../../features/auth/google/application/googleCallback.usecase";

const googleCallback = async (c: Context<AppEnv>) => {
  const code = c.req.query("code");
  const error = c.req.query("error");
  const errorDescription = c.req.query("error_description");

  const redirectToError = (errorMessage: string, errorCode?: string) => {
    const frontendUrl = c.env.FRONTEND_URL;
    if (frontendUrl) {
      const errorUrl = new URL("/auth/error", frontendUrl);
      errorUrl.searchParams.set("message", errorMessage);
      if (errorCode) {
        errorUrl.searchParams.set("code", errorCode);
      }
      return c.redirect(errorUrl.toString(), 302);
    }
    throw new AppError({ 
      status: 400, 
      code: "BAD_REQUEST", 
      message: errorMessage,
      details: { error, errorDescription, queryParams: c.req.query() }
    });
  };

  if (error) {
    const errorMsg = `OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ""}`;
    return redirectToError(errorMsg, error);
  }

  if (!code) {
    const errorMsg = "Missing authorization code. Please try signing in again.";
    return redirectToError(errorMsg, "MISSING_CODE");
  }
  
  const result = await googleCallbackUseCase({
    code,
    clientId: c.env.GOOGLE_CLIENT_ID,
    clientSecret: c.env.GOOGLE_CLIENT_SECRET,
    redirectUri: c.env.GOOGLE_CALLBACK_URL,
    appRedirectUri: c.env.GOOGLE_CALLBACK_URL,
  });

  c.header("Set-Cookie", result.setCookieHeader);
  return c.redirect(result.redirectTo, 302);
}

export { googleCallback }