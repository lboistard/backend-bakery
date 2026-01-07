import { AppError } from "../../../../lib/errors";
import { googleTokenExchangeUseCase } from "./googleTokenExchange.usecase";

const googleCallbackUseCase = async (args: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;  
    appRedirectUri: string;
}) => {
    try {
        if (!args.code) {
            throw new AppError({ status: 400, code: "BAD_REQUEST", message: "Missing authorization code" });
        }
        if (!args.appRedirectUri) {
            throw new AppError({ status: 500, code: "INTERNAL", message: "Missing APP_REDIRECT_URI" });
        }
        
        const result = await googleTokenExchangeUseCase({
            code: args.code,
            redirectUri: args.redirectUri,
            clientId: args.clientId,
            clientSecret: args.clientSecret,
        });
        
        return {
            setCookieHeader: result.setCookieHeader,
            redirectTo: args.appRedirectUri,
        };
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError({
            status: 500,
            code: "INTERNAL",
            message: "Failed to handle Google callback",
            details: { cause: String(err) },
        });
    }
}

export { googleCallbackUseCase }