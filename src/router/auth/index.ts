import { OpenAPIHono } from "@hono/zod-openapi"
import { googleAuthRoute } from "./googleAuth.route"
import { googleAuth } from "../../controller/auth/googleAuth.controller"
import { googleCallback, googleTokenExchange } from "../../controller/auth"
import { googleCallbackRoute } from "./googleCallback.route"
import { googleTokenExchangeRoute } from "./googleTokenExchange.route"
import { AppEnv } from "../../config/bindings"

const authRouter = new OpenAPIHono<AppEnv>()

authRouter.openapi(googleAuthRoute, (c) => googleAuth(c))
authRouter.openapi(googleCallbackRoute, async (c) => await googleCallback(c))
authRouter.openapi(googleTokenExchangeRoute, async (c) => await googleTokenExchange(c))

export { authRouter }