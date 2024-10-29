import mongoose, { Document, Schema } from "mongoose";
import dotenv from "dotenv";
import { bcrypt } from "../utils/bcrypt.js";
import { enumRoles } from "../utils/enums.js";
dotenv.config({ path: "../.env" });
export interface UserAttributes {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    verification_email: boolean;
    picture?: string;
    role: keyof typeof enumRoles;
    refreshTokens?: mongoose.Types.ObjectId[];
}
interface UserDocument extends Document, UserAttributes {
    _id: mongoose.Types.ObjectId;
}
const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            maxlength: 50,
            set(value: string) {
                return value.trim();
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 200,
            set(value: string) {
                return value.trim();
            },
        },
        password: {
            type: String,
            required: false,
            maxlength: 100,
        },
        verification_email: {
            type: Boolean,
            required: true,
        },
        picture: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: Object.values(enumRoles),
            required: true,
        },
        refreshTokens: [{ type: mongoose.Types.ObjectId, ref: "RefreshToken" }],
    },
    {
        collection: "users",
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
        },
        toObject: {
            virtuals: true,
            versionKey: false,
        },
    }
);

userSchema.virtual("devices", {
    ref: "RefreshToken",
    localField: "_id",
    foreignField: "user_id",
});

userSchema.virtual("magic_movers", {
    ref: "MagicMover",
    localField: "_id",
    foreignField: "user_id",
});

userSchema.virtual("magic_items", {
    ref: "MagicItems",
    localField: "_id",
    foreignField: "user_id",
});
userSchema.pre<UserDocument>("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt(this.password);
    }
    next();
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
