import mongoose, { Document, Schema } from "mongoose";
import dotenv from "dotenv";
import { enumState } from "../utils/enums.js";
dotenv.config();
interface MoverLogsAttributes {
    _id: mongoose.Types.ObjectId;
    trip_id: mongoose.Schema.Types.ObjectId;
    state: keyof typeof enumState;
}
interface MoverLogsDocument extends Document, MoverLogsAttributes {
    _id: mongoose.Types.ObjectId;
}
const moverLogsSchema = new Schema<MoverLogsDocument>(
    {
        trip_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
        state: {
            type: String,
            enum: Object.values(enumState),
            required: true,
        },
    },
    {
        collection: "mover_logs",
        timestamps: true,
        versionKey: false,
    }
);

const MoverLogs = mongoose.model<MoverLogsDocument>(
    "MoverLogs",
    moverLogsSchema
);

export default MoverLogs;
