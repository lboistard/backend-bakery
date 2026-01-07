import type { MiddlewareHandler } from "hono";
import { logger } from "../lib/logger";
import { AppError } from "../lib/errors";
import { getSessionWithUser } from "../features/auth/google/infrastructure/session.repo";
import type { AppEnv } from "../config/bindings";

const requestId: MiddlewareHandler = async (c, next) => {
    const id = c.req.header("x-request-id") ?? crypto.randomUUID();
    c.set("requestId", id);
    c.header("x-request-id", id);
    await next();
};

const accessLog: MiddlewareHandler = async (c, next) => {
    const start = Date.now();
    await next();
    const durationMs = Date.now() - start;
    
    logger.info(
        {
            requestId: c.get("requestId"),
            method: c.req.method,
            path: c.req.path,
            status: c.res.status,
            durationMs,
        },
        "request.completed"
    );
};

/**
 * Authentication middleware that validates the session cookie and attaches the user to context.
 */
const authenticate: MiddlewareHandler<AppEnv> = async (c, next) => {
    const cookieHeader = c.req.header("Cookie");
    
    if (!cookieHeader) {
        await next();
        return;
    }
    
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string>);
    
    const sessionId = cookies.sid;
    
    if (!sessionId) {
        await next();
        return;
    }
    
    try {
        const result = await getSessionWithUser(sessionId);
        
        if (result) {
            c.set("user", result.user);
        }
    } catch (err) {
        logger.error({ error: err }, "Failed to validate session");
    }
    
    await next();
};

/**
 * Middleware that requires authentication. Will return 401 if no valid session is found.
 */
const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
    const user = c.get("user");
    
    if (!user) {
        throw new AppError({
            status: 401,
            code: "UNAUTHORIZED",
            message: "Authentication required",
        });
    }
    
    await next();
};

export { requestId, accessLog, authenticate, requireAuth }