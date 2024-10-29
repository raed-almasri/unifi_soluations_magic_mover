import { auth } from "../middleware/auth.js";
import { validate } from "../validation/validation.js";
import { enumTypeInput } from "../utils/enums.js";

import { Request, Response, NextFunction } from "express";
const execute =
    (fun: Function) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fun(req, res, next)).catch(async (error) => {
            if (error.code == "ENOENT") {
            } else next(error);
        });
    };
export { auth, execute, validate, enumTypeInput as type };
