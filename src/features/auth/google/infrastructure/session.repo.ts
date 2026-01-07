import { SessionModel } from "../../../../models/session";
import { Types } from "mongoose";
import { UserModel } from "../../../../models/user";

const createSession = async (args: { userId: Types.ObjectId }) => {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    return SessionModel.create({ userId: args.userId, expiresAt });
};

const getSessionWithUser = async (sessionId: string) => {
    if (!Types.ObjectId.isValid(sessionId)) {
        return null;
    }
    
    const session = await SessionModel.findById(sessionId).lean();
    
    if (!session) {
        return null;
    }
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
        return null;
    }
    
    // Get the user
    const user = await UserModel.findById(session.userId).lean();
    
    if (!user) {
        return null;
    }
    
    return {
        session,
        user,
    };
};

export { createSession, getSessionWithUser }