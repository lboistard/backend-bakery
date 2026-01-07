import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { logger } from "../lib/logger";
import { isAppError } from "../lib/errors";

const redactSecrets = (obj: unknown) => {
    if (!obj || typeof obj !== "object") return obj;
    const clone: Record<string, unknown> = { ...obj };
    for (const k of ["access_token", "refresh_token", "id_token", "client_secret"]) {
        if (k in clone) clone[k] = "[REDACTED]";
    }
    return clone;
}

const onError = (err: unknown, c: Context) => {
    const requestId = c.get("requestId");
    const common = {
        requestId,
        method: c.req.method,
        path: c.req.path,
    };
    
    if (isAppError(err)) {
        const level = err.status >= 500 ? "error" : "warn";
        
        logger[level](
            {
                ...common,
                status: err.status,
                code: err.code,
                details: redactSecrets(err.details),
            },
            err.message
        );
        
        return c.json(
            {
                error: {
                    code: err.code,
                    message: err.message,
                    requestId,
                },
            },
            err.status as ContentfulStatusCode
        );
    }
    
    logger.error(
        {
            ...common,
            status: 500,
            err,
        },
        "Unhandled exception"
    );
    
    return c.json(
        {
            error: {
                code: "INTERNAL",
                message: "Unexpected error",
                requestId,
            },
        },
        500 as ContentfulStatusCode
    );
}

export { onError }