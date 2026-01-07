import type { OpenAPIHono } from "@hono/zod-openapi"
import { swaggerUI } from "@hono/swagger-ui"
import { AppEnv } from "../config/bindings"
import { requireAuth } from "./middleware"

const mountDocs = (app: OpenAPIHono<AppEnv>) => {
    app.use("/openapi.json", requireAuth)
    
    app.doc("/openapi.json", {
        openapi: "3.0.0",
        info: {
            title: "Backend Bakery API",
            version: "1.0.0",
            description: "This API uses cookie-based session authentication.",
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "sid",
                    description: "Session ID cookie. Authenticate via /api/auth/google or /api/auth/token/exchange first to get a session cookie. The cookie is automatically sent by the browser after authentication.",
                },
            },
        },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    
    const ui = swaggerUI({ 
        url: "/openapi.json",
    })
    app.get("/docs", requireAuth, ui)
    app.get("/docs/*", requireAuth, ui)
}

export { mountDocs }
