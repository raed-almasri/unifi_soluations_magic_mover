import express, { Request, Express } from "express";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import logRegisterConfig from "./config/log.js";
import corsConfig from "./config/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { limit } from "./middleware/limit.js";
// Protection
import helmet from "./config/helmet.js";
import router from "./routers/index.js";
import { localesLanguages } from "./locales/locales.js";

dotenv.config({ path: "./.env" });
let app: Express = express();

// Swagger API documentation
import { loadJson } from "./utils/jsonTools.js";
let swaggerJsdoc: any = loadJson("./swagger.json");
if (process.env.NODE_ENV == "developer") {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerJsdoc, {
            explorer: true,
            swaggerOptions: {
                theme: "dark",
                requestInterceptor: (request: Request) => {
                    request.headers["accept-language"] = "en";
                    return request;
                },
            },
        })
    );
}

app.use(limit);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "20kb" }));

app.use(bodyParser.urlencoded({ extended: true }));

corsConfig(app);

helmet(app);

logRegisterConfig(app);

app.use(compression());

// I18N for multi language
localesLanguages(app);
app.use(router);

app.use(errorHandler);
export default app;
