import { UserModel } from "../../../../models/user";

const enc = (s: string) => Buffer.from(s, "utf8").toString("base64");

const upsertGoogleUser = async (args: {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
    refreshToken?: string;
    scope?: string;
}) => {

    const user = await UserModel.findOne({
        provider: "google",
        providerSub: args.sub,
    }).exec();

    const updateData = {
        email: args.email,
        name: args.name,
        picture: args.picture,
        googleScopes: args.scope ? args.scope.split(" ") : [],
        googleRefreshTokenEnc: args.refreshToken ? enc(args.refreshToken) : undefined,
    };

    if (user) {
    
        Object.assign(user, updateData);
        return user.save();
    } else {
    
        return UserModel.create({
            provider: "google",
            providerSub: args.sub,
            ...updateData,
        });
    }
};

export { upsertGoogleUser }