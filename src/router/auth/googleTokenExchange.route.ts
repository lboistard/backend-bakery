import { createRoute } from "@hono/zod-openapi"
import { z } from "zod"

const googleTokenExchangeRoute = createRoute({
  method: "post",
  path: "/token/exchange",
  tags: ["auth"],
  summary: "Exchange Google OAuth code for session",
  description: "Exchanges a Google OAuth authorization code for a session. Sets a session cookie (sid) that will be used for authenticated requests. **Note**: When testing from Swagger UI, the Set-Cookie header may not be automatically processed. For best results, authenticate via browser first by visiting /api/auth/google, then return to Swagger UI.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.string().describe("Google OAuth authorization code"),
            redirectUri: z.string().describe("The redirect URI used in the OAuth flow"),
            codeVerifier: z.string().optional().describe("PKCE code verifier (if using PKCE)"),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Token exchange successful. Session cookie (sid) is set via Set-Cookie header.",
      headers: {
        "Set-Cookie": {
          description: "Session cookie (sid) - automatically set by browser",
          schema: {
            type: "string",
          },
        },
      },
      content: {
        "application/json": {
          schema: z.object({
            ok: z.boolean(),
            user: z.object({
              id: z.string(),
              email: z.string().nullable(),
              name: z.string().nullable(),
              picture: z.string().nullable(),
            }),
          }),
        },
      },
    },
    400: {
      description: "Bad request - missing or invalid parameters",
    },
    401: {
      description: "Authentication failed - invalid code or token exchange failed",
    },
  },
})

export { googleTokenExchangeRoute }