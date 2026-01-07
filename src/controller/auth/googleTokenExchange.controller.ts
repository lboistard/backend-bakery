import { AppError } from "../../lib/errors";
import { AppEnv } from "../../config/bindings";
import { Context } from "hono";
import { googleTokenExchangeUseCase } from "../../features/auth/google/application/googleTokenExchange.usecase";

const googleTokenExchange = async (c: Context<AppEnv>) => {
    let body: { code?: string; redirectUri?: string; codeVerifier?: string } | null = null;
    
    try {
      body = await c.req.json();
    } catch (err) {
      throw new AppError({ 
        status: 400, 
        code: "BAD_REQUEST", 
        message: "Invalid JSON body" 
      });
    }
  
    if (!body) {
      throw new AppError({ 
        status: 400, 
        code: "BAD_REQUEST", 
        message: "Request body is required" 
      });
    }

    if (!body.code) {
      throw new AppError({ 
        status: 400, 
        code: "BAD_REQUEST", 
        message: "Missing code" 
      });
    }

    if (!body.redirectUri) {
      throw new AppError({ 
        status: 400, 
        code: "BAD_REQUEST", 
        message: "Missing redirectUri" 
      });
    }
  
    const result = await googleTokenExchangeUseCase({
      code: body.code,
      redirectUri: body.redirectUri,
      codeVerifier: body.codeVerifier,
      clientId: c.env.GOOGLE_CLIENT_ID,
      clientSecret: c.env.GOOGLE_CLIENT_SECRET,
    });
  
    c.header("Set-Cookie", result.setCookieHeader);
    return c.json({ ok: true, user: result.userDto });
  }

  export { googleTokenExchange }