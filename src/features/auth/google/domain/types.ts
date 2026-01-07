export type GoogleTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    refresh_token?: string;
    id_token?: string;
};

export type GoogleIdProfile = {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
};