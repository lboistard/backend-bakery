import { AppError } from "../../../../lib/errors";
import { exchangeAuthorizationCode } from "../infrastructure/google.oauth.client";
import { verifyIdToken } from "../infrastructure/google.idtoken.verify";
import { upsertGoogleUser } from "../infrastructure/user.repo";
import { createSession } from "../infrastructure/session.repo";
import { buildSetCookieHeader } from "../../shared/sessionCookie";

const googleTokenExchangeUseCase = async (args: {
    code: string;
    redirectUri: string;
    clientId: string;
    clientSecret: string;
    codeVerifier?: string;
}) => {
    try {
        if (!args.code) {
            throw new AppError({ status: 400, code: "BAD_REQUEST", message: "Missing authorization code" });
        }
        if (!args.redirectUri) {
            throw new AppError({ status: 400, code: "BAD_REQUEST", message: "Missing redirectUri" });
        }
        
        const tokens = await exchangeAuthorizationCode({
            code: args.code,
            redirectUri: args.redirectUri,
            clientId: args.clientId,
            clientSecret: args.clientSecret,
            codeVerifier: args.codeVerifier,
        }).catch((cause) => {
            throw new AppError({
                status: 401,
                code: "OAUTH_EXCHANGE_FAILED",
                message: "Google token exchange failed",
                details: { cause: String(cause) },
            });
        });
        
        if (!tokens.id_token) {
            throw new AppError({
                status: 401,
                code: "OAUTH_IDTOKEN_INVALID",
                message: "Missing id_token (ensure scope includes openid)",
            });
        }
        
        const profile = await verifyIdToken(tokens.id_token, args.clientId).catch((cause) => {
            throw new AppError({
                status: 401,
                code: "OAUTH_IDTOKEN_INVALID",
                message: "Invalid Google id_token",
                details: { cause: String(cause) },
            });
        });
        
        const user = await upsertGoogleUser({
            sub: profile.sub,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            refreshToken: tokens.refresh_token,
            scope: tokens.scope,
        });
        
        const session = await createSession({ userId: user._id });
        
        return {
            setCookieHeader: buildSetCookieHeader(session._id.toString()),
            userDto: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
        };
    } catch (err) {
        if (err instanceof AppError) throw err;
        
        throw new AppError({
            status: 500,
            code: "INTERNAL",
            message: "Failed to exchange Google token",
            details: { cause: String(err) },
        });
    }
}

export { googleTokenExchangeUseCase } 