import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

declare global {
    namespace Express {
        interface Request {
            getLocalLanguage: (key: string) => string;
            user: {
                id: string;
                deviceId: string;
                role: string;
            };
        }
    }
}
export const sendHttpResponse = (
    req: Request,
    res: Response,
    data: any = null,
    status: number = StatusCodes.OK
) => {
    data = {
        message: req.getLocalLanguage("messages.success"),
        data,
        error: null,
    };

    return res.status(status).send({
        success: true,
        result: data,
    });
};
export const sendErrorHttpResponse = (
    res: Response,
    errorMessage: any,
    status: number = 400,
    errorCode: any = 400
) => {
    if (!errorMessage) {
        errorMessage[0] = "Internal Server Error";
    }
    errorCode = errorCode ? errorCode : null;

    return res.status(status).send({
        success: false,
        result: {
            message: errorMessage,
            data: null,
            error: errorCode,
        },
    });
};
