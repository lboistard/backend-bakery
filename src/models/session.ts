import { Schema, model, type InferSchemaType, type Model} from "mongoose";

const SessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export type Session = InferSchemaType<typeof SessionSchema>;
export const SessionModel: Model<Session> = model<Session>("Session", SessionSchema);