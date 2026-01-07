import { createRoute } from "@hono/zod-openapi"

const googleAuthRoute = createRoute({
  method: "get",
  path: "/google",
  tags: ["auth"],
  responses: {
    302: {
      description: "Redirect to Google OAuth",
    },
  },
})

export { googleAuthRoute }