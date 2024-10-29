import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: `./.env` });
import { Express } from "express";
export default (app: Express) => {
    app.all("/*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Credentials");
        res.header(
            "Access-Control-Allow-Methods",
            "GET,PUT,POST,DELETE,OPTIONS"
        );
        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials,Access-Control-Allow-Methods"
        );

        if (req.method === "OPTIONS") {
            res.status(200).end();
        } else {
            next();
        }
    });

    app.use(
        cors({
            origin: `*`,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        })
    );
};
