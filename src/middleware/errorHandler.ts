import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { sendErrorHttpResponse } from "../utils/HttpResponse.js";
export let errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
    let errorMessage = error.message || "Internal Server Error";

    if (process.env.NODE_ENV == "developer") console.log(error);
    sendErrorHttpResponse(res, errorMessage, statusCode);
};
