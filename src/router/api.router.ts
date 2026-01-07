import { OpenAPIHono } from "@hono/zod-openapi"
import { authRouter } from "./auth/"
import { userRouter } from "./user/"
import { AppEnv } from "../config/bindings"

const apiRouter = new OpenAPIHono<AppEnv>()

apiRouter.route("/api/auth", authRouter)
apiRouter.route("/api/user", userRouter)

export { apiRouter }