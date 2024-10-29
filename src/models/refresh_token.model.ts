import mongoose, { Document, Schema } from "mongoose";
export interface RefreshTokenAttributes {
    _id: mongoose.Types.ObjectId;
    refresh_token: string;
    deviceId: string;
    ip: string;
    user_id: mongoose.Types.ObjectId;
}

interface RefreshTokenDocument extends Document, RefreshTokenAttributes {
    _id: mongoose.Types.ObjectId;
}
const refreshTokenSchema = new Schema<RefreshTokenDocument>(
    {
        refresh_token: {
            type: String,
            maxlength: 1000,
            required: false,
        },
        deviceId: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        collection: "refresh_tokens",
        timestamps: true,
        versionKey: false,
    }
);

const RefreshToken = mongoose.model<RefreshTokenDocument>(
    "RefreshToken",
    refreshTokenSchema
);

export default RefreshToken;
