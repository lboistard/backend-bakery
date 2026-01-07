import { Schema, model, type InferSchemaType, type Model, type Types } from "mongoose";

const UserSchema = new Schema(
  {
    provider: { type: String, required: true, enum: ["google"], index: true },
    providerSub: { type: String, required: true, index: true }, // Google "sub"

    email: { type: String },
    name: { type: String },
    picture: { type: String },
    googleRefreshTokenEnc: { type: String },
    googleScopes: { type: [String], default: [] },
  },
  { timestamps: true }
);

UserSchema.index({ provider: 1, providerSub: 1 }, { unique: true });

export type User = InferSchemaType<typeof UserSchema> & {
  _id: Types.ObjectId;
};
export const UserModel: Model<User> = model<User>("User", UserSchema);