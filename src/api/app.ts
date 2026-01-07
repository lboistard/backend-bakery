import { OpenAPIHono } from "@hono/zod-openapi"
import { apiRouter} from "../router/api.router"
import { mountDocs } from "./docs"
import { onError } from "./onError"
import { accessLog, requestId, authenticate } from "./middleware"
import { AppEnv } from "../config/bindings"

const createApp = () => {
  const app = new OpenAPIHono<AppEnv>()
  
  app.use("*", requestId);
  app.use("*", accessLog);
  app.use("*", authenticate);
  
  app.route("/", apiRouter)
  
  mountDocs(app)
  
  app.onError(onError);
  
  return app
}

export { createApp }