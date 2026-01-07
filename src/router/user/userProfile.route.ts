import { createRoute } from "@hono/zod-openapi"
import { z } from "zod"

const userProfileRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["user"],
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: "Get current user profile",
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            email: z.string().nullable(),
            name: z.string().nullable(),
            picture: z.string().nullable(),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized - Missing or invalid session cookie",
    },
  },
})

export { userProfileRoute }
