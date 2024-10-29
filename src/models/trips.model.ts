import mongoose, { Document, Schema } from "mongoose";
import dotenv from "dotenv";
import { enumState } from "../utils/enums.js";
dotenv.config({ path: "../.env" });
export interface TripAttributes {
    _id: mongoose.Types.ObjectId;
    name: string;
    quest_state: keyof typeof enumState;
    magic_mover_id: mongoose.Types.ObjectId;
}
interface TripDocument extends Document, TripAttributes {
    magic_mover_id: mongoose.Types.ObjectId;
    _id: mongoose.Types.ObjectId;
}
const tripSchema = new Schema<TripDocument>(
    {
        name: {
            type: String,
            required: true,
            maxlength: 50,
            set(value: string) {
                return value.trim();
            },
        },
        quest_state: {
            type: String,
            enum: Object.values(enumState),
            required: true,
        },
        magic_mover_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MagicMover",
            required: true,
        },
    },
    {
        collection: "trips",
        timestamps: true,
        versionKey: false,
    }
);

tripSchema.virtual("magic_items_info", {
    ref: "MagicItems",
    localField: "_id",
    foreignField: "trip_id",
});

tripSchema.virtual("MoverLogsInfo", {
    ref: "MoverLogs",
    localField: "_id",
    foreignField: "trip_id",
});
const Trip = mongoose.model<TripDocument>("Trip", tripSchema);

export default Trip;
