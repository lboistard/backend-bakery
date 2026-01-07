import { AppError } from "../../../../lib/errors";

const makeGoogleAuthUrlUseCase = (args: {
  clientId: string;
  redirectUri: string;
  state: string;
  scopes?: string[];
  accessType?: "online" | "offline";
  prompt?: "consent" | "select_account";
}) => {
  try {
    if (!args.clientId) {
      throw new AppError({ status: 500, code: "INTERNAL", message: "Missing GOOGLE_CLIENT_ID" });
    }
    if (!args.redirectUri) {
      throw new AppError({ status: 500, code: "INTERNAL", message: "Missing GOOGLE_REDIRECT_URI" });
    }

    const scopes = args.scopes?.length ? args.scopes : ["openid", "email", "profile"];

    try {
      new URL(args.redirectUri);
    } catch {
      throw new AppError({ 
        status: 500, 
        code: "INTERNAL", 
        message: "Invalid redirect URI format",
        details: { redirectUri: args.redirectUri }
      });
    }

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", args.clientId);
    url.searchParams.set("redirect_uri", args.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", scopes.join(" "));
    url.searchParams.set("state", args.state);
    url.searchParams.set("access_type", args.accessType ?? "online");

    console.log("🔍 Google OAuth URL generated:");
    console.log("  - Redirect URI:", args.redirectUri);
    console.log("  - Full URL:", url.toString());

    return url.toString();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError({
      status: 500,
      code: "INTERNAL",
      message: "Failed to build Google auth URL",
      details: { cause: String(err) },
    });
  }
}

export { makeGoogleAuthUrlUseCase }