import app from "./app.js";

import mongoose from "mongoose";

import defaultData from "./utils/default_data.js";

const mongoURI: string =
    process.env.MONGODB_URL || "mongodb://localhost:27017/magice_tansporters";
import dotenv from "dotenv";

dotenv.config();
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("Successfully connected to MongoDB");
        app.listen(process.env.PORT, async () => {
            // await addDefaultDataIfNotExists();
            console.log(
                `Listening at http://${process.env.DOMAIN}:${process.env.PORT} , Mode:${process.env.NODE_ENV} ✅`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

let addDefaultDataIfNotExists = async () => {
    await defaultData();
};
