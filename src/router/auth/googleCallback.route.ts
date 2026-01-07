import { createRoute } from "@hono/zod-openapi"

const googleCallbackRoute = createRoute({
  method: "get",
  path: "/google/callback",
  tags: ["auth"],
  responses: {
    302: {
      description: "Redirect to Google OAuth",
    },
  },
})

export { googleCallbackRoute }