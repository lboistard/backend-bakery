export type GoogleTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    refresh_token?: string;
    id_token?: string;
};

const exchangeAuthorizationCode = async (args: {
    code: string;
    redirectUri: string;
    clientId: string;
    clientSecret: string;
    codeVerifier?: string;
}): Promise<GoogleTokenResponse> => {
    const params = new URLSearchParams({
        grant_type: "authorization_code",
        code: args.code,
        client_id: args.clientId,
        client_secret: args.clientSecret,
        redirect_uri: args.redirectUri,
    });
    
    if (args.codeVerifier) params.set("code_verifier", args.codeVerifier);
    
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: params,
    });
    
    const json = (await res.json().catch(() => null));
    if (!res.ok) throw new Error(`Google token exchange failed: ${JSON.stringify(json)}`);
    if (!json?.access_token) throw new Error(`Missing access_token: ${JSON.stringify(json)}`);
    
    return json as GoogleTokenResponse;
}

export { exchangeAuthorizationCode }