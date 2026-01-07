const buildSetCookieHeader = (sessionId: string) => {
    const isProd = process.env.NODE_ENV === "production";
    const parts = [
        `sid=${sessionId}`,
        "Path=/",
        "HttpOnly",
        `Max-Age=${60 * 60 * 24 * 30}`,
        isProd ? "Secure" : "",
        `SameSite=${isProd ? "None" : "Lax"}`,
    ].filter(Boolean);
    
    return parts.join("; ");
}

export { buildSetCookieHeader }