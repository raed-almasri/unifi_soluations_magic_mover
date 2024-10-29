import _ from "lodash";
import { StatusCodes } from "http-status-codes";
import { enumRoles } from "../../utils/enums.js";
import Users, { UserAttributes } from "../../models/user.model.js";
import MagicMover, {
    MagicMoverAttributes,
} from "../../models/magic_mover.model.js";
import { Request, Response } from "express";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
export default {
    create: async (req: Request, res: Response): Promise<void> => {
        let user_id: string;
        if (req.query.user_id && typeof req.query.user_id === "string") {
            user_id = req.query.user_id;
        } else {
            throw new Error("user_id is required");
        }

        let check: UserAttributes | null = await Users.findOne({
            _id: user_id,
            role: enumRoles.mover,
        }).select("_id");
        if (!check)
            throw new Error(req.getLocalLanguage("error.item.not_found"));

        await MagicMover.create({
            ...req.body,
            user_id: user_id,
        });

        sendHttpResponse(req, res, null, StatusCodes.CREATED);
    },
    update: async (req: Request, res: Response): Promise<void> => {
        let userId: string;
        if (req.query.user_id && typeof req.query.user_id === "string") {
            userId = req.query.user_id;
        } else {
            throw new Error("user_id is required");
        }
        let moverId: string;
        if (req.query.mover_id && typeof req.query.mover_id === "string") {
            moverId = req.query.mover_id;
        } else {
            throw new Error("moverId is required");
        }
        const check: MagicMoverAttributes | null = await MagicMover.findOne({
            _id: moverId,
            user_id: userId,
        }).populate({
            path: "user_id",
            match: { _id: userId, role: enumRoles.mover },
            select: "_id",
        });

        if (!check)
            throw new Error(req.getLocalLanguage("error.item.not_found"));

        await MagicMover.updateOne({ _id: moverId }, { ...req.body });
        res.status(StatusCodes.OK).json({
            success: true,
            msg: req.getLocalLanguage("messages.success"),
        });
        sendHttpResponse(req, res);
    },
    remove: async (req: Request, res: Response): Promise<void> => {
        let userId: string;
        if (req.query.user_id && typeof req.query.user_id === "string") {
            userId = req.query.user_id;
        } else {
            throw new Error("user_id is required");
        }
        let moverId: string;
        if (req.query.mover_id && typeof req.query.mover_id === "string") {
            moverId = req.query.mover_id;
        } else {
            throw new Error("moverId is required");
        }
        let check: MagicMoverAttributes | null = await MagicMover.findOne({
            _id: moverId,
            user_id: userId,
        })
            .select("_id")
            .lean();

        if (!check)
            throw new Error(req.getLocalLanguage("error.item.not_found"));

        await MagicMover.deleteMany({ _id: moverId, user_id: userId });

        sendHttpResponse(req, res);
    },
};
