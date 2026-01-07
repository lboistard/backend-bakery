import { OpenAPIHono } from "@hono/zod-openapi"
import { userProfileRoute } from "./userProfile.route"
import { getUserProfile } from "../../controller/user/userProfile.controller"
import { AppEnv } from "../../config/bindings"

const userRouter = new OpenAPIHono<AppEnv>()

userRouter.openapi(userProfileRoute, getUserProfile);

export { userRouter }
