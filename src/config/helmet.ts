import helmet from "helmet";
import { Express } from "express";
export default (app: Express) => {
    app.use(helmet());
    app.use(
        helmet.hsts({
            maxAge: 200,
            includeSubDomains: false,
        })
    );
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.xssFilter());
    app.use(helmet.hidePoweredBy());
};
