import { jwtVerify, createRemoteJWKSet } from "jose";

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

type GoogleIdProfile = {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
};

const verifyIdToken = async (idToken: string, clientId: string): Promise<GoogleIdProfile> => {
    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: clientId,
    });
    
    return {
        sub: String(payload.sub),
        email: payload.email ? String(payload.email) : undefined,
        name: payload.name ? String(payload.name) : undefined,
        picture: payload.picture ? String(payload.picture) : undefined,
    };
}

export { verifyIdToken }
export type { GoogleIdProfile }