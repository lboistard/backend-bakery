type ErrorCode =
| "BAD_REQUEST"
| "UNAUTHORIZED"
| "FORBIDDEN"
| "NOT_FOUND"
| "CONFLICT"
| "RATE_LIMITED"
| "INTERNAL"
| "OAUTH_EXCHANGE_FAILED"
| "OAUTH_IDTOKEN_INVALID";

class AppError extends Error {
    status: number;
    code: ErrorCode;
    details?: unknown;
    
    constructor(args: {
        message: string;
        status: number;
        code: ErrorCode;
        details?: unknown;
    }) {
        super(args.message);
        this.name = "AppError";
        this.status = args.status;
        this.code = args.code;
        this.details = args.details;
    }
}

const isAppError = (e: unknown): e is AppError => e instanceof AppError;

export { AppError, isAppError }
export type { ErrorCode }