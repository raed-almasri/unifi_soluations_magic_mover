import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { getFromCache } from "./cache.js";
import { sendErrorHttpResponse } from "../utils/HttpResponse.js";

interface DecodedToken {
    userId: string;
    deviceId: string;
    role: string;
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const TOKEN_SECRET_KEY: string = process.env.TOKEN_SECRET_KEY || "";
        const rawToken: string | undefined = req.headers.authorization
            ? Array.isArray(req.headers.authorization)
                ? req.headers.authorization[0]
                : req.headers.authorization
            : undefined;

        if (!rawToken) {
            throw new Error(
                "Token does not exist, please set token and try again :)"
            );
        }

        let token: string = rawToken.startsWith("Bearer ")
            ? rawToken.replace("Bearer ", "")
            : rawToken;

        const decoded: DecodedToken | null = verifyToken(
            token,
            TOKEN_SECRET_KEY
        );
        if (
            !decoded ||
            getFromCache(`refreshToken_${decoded.userId}_${decoded.deviceId}`)
        ) {
            throw new Error("Forbidden token");
        }

        req.user = {
            id: decoded.userId,
            deviceId: decoded.deviceId,
            role: decoded.role,
        };

        next();
    } catch (err: any) {
        sendErrorHttpResponse(res, err.message, StatusCodes.UNAUTHORIZED);
    }
};
