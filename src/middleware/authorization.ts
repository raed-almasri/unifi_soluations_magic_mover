import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { sendErrorHttpResponse } from "../utils/HttpResponse.js";
export const authorization = (type: string) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (type !== req.user.role)
                throw new Error(
                    "Sorry,You don't have any access during this endpoint"
                );
            next();
        } catch (err: any) {
            sendErrorHttpResponse(res, err.message, StatusCodes.FORBIDDEN);
        }
    };
};
