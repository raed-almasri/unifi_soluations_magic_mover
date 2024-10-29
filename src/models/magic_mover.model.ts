import mongoose, { Document, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
export interface MagicMoverAttributes {
    _id: mongoose.Types.ObjectId;
    weight: number;
    energy: number;
    user_id: mongoose.Types.ObjectId;
}
interface MagicMoverDocument extends Document, MagicMoverAttributes {
    user_id: mongoose.Types.ObjectId;
    _id: mongoose.Types.ObjectId;
}
const magicMoverSchema = new Schema<MagicMoverDocument>(
    {
        weight: {
            type: Number,
            required: true,
        },
        energy: {
            type: Number,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        collection: "magic_movers",
        timestamps: true,
        versionKey: false,
    }
);

magicMoverSchema.virtual("every_trips", {
    ref: "Trips",
    localField: "_id",
    foreignField: "magic_mover_id",
});
const MagicMover = mongoose.model<MagicMoverDocument>(
    "MagicMover",
    magicMoverSchema
);

export default MagicMover;
