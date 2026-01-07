import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
    level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
    
    transport: !isProd
    ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
        },
    }
    : undefined,
    
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    
    base: {
        service: "api",
        env: process.env.NODE_ENV,
    },
});

export { logger }