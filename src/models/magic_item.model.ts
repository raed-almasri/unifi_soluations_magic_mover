import mongoose, { Document, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
interface MagicItemsAttributes {
    _id: mongoose.Types.ObjectId;
    name: string;
    weight: number;
    trip_id: mongoose.Schema.Types.ObjectId;
}

interface MagicItemsDocument extends Document, MagicItemsAttributes {
    _id: mongoose.Types.ObjectId;
}
const magicItemsSchema = new Schema<MagicItemsDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },

        trip_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
    },
    {
        collection: "magic_items",
        timestamps: true,
        versionKey: false,
    }
);

const MagicItems = mongoose.model<MagicItemsDocument>(
    "MagicItems",
    magicItemsSchema
);

export default MagicItems;
