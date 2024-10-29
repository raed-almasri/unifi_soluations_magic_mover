import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config({ path: `../.env` });
//UTILS
import { compare } from "../utils/bcrypt.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import {
    addToCache,
    getFromCache,
    deleteFromCache,
} from "../middleware/cache.js";
import Users from "../models/user.model.js";
import { UserAttributes } from "../models/user.model.js";
import RefreshToken, {
    RefreshTokenAttributes,
} from "../models/refresh_token.model.js";
import { Request, Response } from "express";
import { sendHttpResponse } from "../utils/HttpResponse.js";
export default {
    /**
     * Handles the login process for a user.
     *
     * This asynchronous function checks if a user with the specified email exists
     * in the database and allows for user authentication.
     *
     * @async
     * @function login
     * @param {Request} req - The request object containing user input data.
     * @param {Response} res - The response object used to send back the desired HTTP response.
     * @returns {Promise<void>} A promise that resolves when the login process is complete.
     * @throws {Error} Throws an error if the user is not found or if there is an issue during the database query.
     *
     * await login(req, res);
     */
    login: async (req: Request, res: Response): Promise<void> => {
        let myInfo: UserAttributes | any = await Users.findOne({
            email: req.body.email.trim(),
        })
            .select("_id name email password verification_email picture role")
            .lean();

        if (!myInfo)
            throw Error(req.getLocalLanguage("error.auth.email_incorrect"));

        const validPassword: boolean = await compare(
            req.body.password,
            myInfo.password
        );
        if (!validPassword)
            throw Error(req.getLocalLanguage("error.auth.password_incorrect"));

        let deviceId: string = uuidv4();
        let token: string = generateToken(
            {
                userId: myInfo._id,
                deviceId,
                role: myInfo.role,
                verification_email: myInfo.verification_email,
            },
            process.env.TOKEN_SECRET_KEY as string,
            process.env.TOKEN_EXPIRES_IN as string
        );
        const refreshToken: string = generateToken(
            {
                userId: myInfo._id,
                deviceId,
            },
            process.env.REFRESH_TOKEN_SECRET_KEY as string,
            process.env.REFRESH_TOKEN_EXPIRES_IN as string
        );

        const refreshTokenCreated: RefreshTokenAttributes =
            await RefreshToken.create({
                user_id: myInfo._id,
                refresh_token: refreshToken,
                deviceId,
                ip: req.ip,
            });
        await Users.updateOne(
            { _id: myInfo._id },
            { $push: { refreshTokens: refreshTokenCreated._id } }
        );

        deleteFromCache([
            `refreshToken_${myInfo.id}`,
            `refreshTokenNotValid_${myInfo.id}`,
        ]);
        let response = {
            token,
            refreshToken,
            role: myInfo.role,
            verification_email:
                myInfo.verification_email === "0" ? false : true,
        };
        sendHttpResponse(req, res, response);
    },
    logout: async (req: Request, res: Response): Promise<void> => {
        const record: RefreshTokenAttributes | null =
            await RefreshToken.findOne({
                user_id: req.user.id,
                deviceId: req.user.deviceId.trim(),
            });
        if (!record) throw new Error("You'r token is bad");

        await RefreshToken.deleteMany({
            _id: record._id,
        });

        await Users.updateOne(
            { _id: req.user.id },
            { $pull: { refreshTokens: record._id } }
        );
        addToCache(
            `refreshToken_${req.user.id}_${req.user.deviceId}`,
            "not allow"
        );
        addToCache(
            `refreshTokenNotValid_${req.user.id}_${req.user.deviceId}`,
            "not allow"
        );

        sendHttpResponse(req, res);
    },
    refreshToken: async (req: Request, res: Response): Promise<void> => {
        let { refreshToken } = req.body;
        if (!refreshToken)
            throw Error(req.getLocalLanguage("error.auth.not_found_token"));

        let decodedToken = verifyToken(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY as string
        );

        if (
            !decodedToken ||
            getFromCache(`refreshTokenNotValid_${decodedToken.userId}`)
        )
            throw Error(req.getLocalLanguage("error.auth.forbidden_token"));

        const myInfo: UserAttributes | any = await Users.findOne({
            _id: decodedToken.userId,
        })
            .select("_id")
            .lean();

        if (!myInfo)
            throw new Error(req.getLocalLanguage("error.users.not_found"));
        let deviceId: string = uuidv4();
        let token: string = generateToken(
            {
                userId: myInfo._id,
                deviceId,
            },
            process.env.TOKEN_SECRET_KEY as string,
            process.env.TOKEN_EXPIRES_IN as string
        );
        const newRefreshToken: string = generateToken(
            {
                userId: myInfo._id,
                deviceId,
            },
            process.env.REFRESH_TOKEN_SECRET_KEY as string,
            process.env.REFRESH_TOKEN_EXPIRES_IN as string
        );

        await RefreshToken.deleteMany({
            user_id: myInfo._id,
            deviceId: decodedToken.deviceId,
        });
        await RefreshToken.create({
            user_id: myInfo._id,
            refresh_token: refreshToken,
            deviceId,
            ip: req.ip,
        });
        let response = {
            token,
            refreshToken: newRefreshToken,
        };

        sendHttpResponse(req, res, response);
    },
};
