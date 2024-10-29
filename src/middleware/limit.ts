import { StatusCodes } from "http-status-codes";
import rateLimit from "express-rate-limit";

export const limit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 70,
    standardHeaders: true,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    message: {
        success: false,
        message:
            "Too many requests from this IP, please try again after 1 minutes :) ",
    },
});

export const limitLogin = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    message: {
        success: false,
        message:
            "Too many requests from this device, please try again after 1 minutes :) ",
    },
});
