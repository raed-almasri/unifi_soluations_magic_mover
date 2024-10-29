import _ from "lodash";
import { StatusCodes } from "http-status-codes";
import Users, { UserAttributes } from "../../models/user.model.js";
import { enumRoles } from "../../utils/enums.js";
import { bcrypt } from "../../utils/bcrypt.js";
import { Request, Response } from "express";
import Trip from "../../models/trips.model.js";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
export default {
    create: async (req: Request, res: Response): Promise<void> => {
        if (req.body.password == null)
            throw new Error("Bad Request should be send password");

        let check: UserAttributes | null = await Users.findOne({
            email: req.body.email.trim(),
        }).select("_id");
        if (check) throw new Error(req.getLocalLanguage("error.users.found"));
        await Users.create({
            ...req.body,
            verification_email: false,
            role: enumRoles.mover,
        });

        sendHttpResponse(req, res, null, StatusCodes.CREATED);
    },
    update: async (req: Request, res: Response): Promise<void> => {
        if (req.user.id == req.params.id)
            throw new Error("You can't change of you'r account");
        const checkForEmail: UserAttributes | null = await Users.findOne({
            email: req.body.email.trim(),
            _id: { $ne: req.params.id },
        }).select("_id");

        if (checkForEmail)
            throw new Error(req.getLocalLanguage("error.users.found"));

        let body = req.body;
        if (body.password) body.password = bcrypt(body.password);
        else delete body.password;
        await Users.updateOne({ _id: req.params.id }, { ...req.body });

        sendHttpResponse(req, res);
    },
    remove: async (req: Request, res: Response): Promise<void> => {
        if (req.user.id == req.params.id)
            throw new Error("You can't remove of you'r account");

        let check: UserAttributes | null = await Users.findOne({
            _id: req.params.id,
        }).select("_id");

        if (!check)
            throw new Error(req.getLocalLanguage("error.users.not_found"));

        await Users.deleteMany({ _id: req.params.id });

        sendHttpResponse(req, res);
    },
    fetchAll: async (req: Request, res: Response): Promise<void> => {
        const response: UserAttributes[] = await Users.find(
            { role: enumRoles.mover },
            "_id name email role createdAt"
        ).lean();

        sendHttpResponse(req, res, response);
    },
    fetchAllDesc: async (req: Request, res: Response): Promise<any> => {
        let userId = req.params.id;
        if (
            !(await Users.findOne({
                _id: userId,
            }).select("_id"))
        )
            throw new Error(req.getLocalLanguage("error.users.not_found"));

        let users: UserAttributes[] = await Users.find({
            role: enumRoles.mover,
        })
            .select("_id name email verification_email")
            .lean();

        let response: any = await Promise.all(
            users.map(async (user: UserAttributes): Promise<any> => {
                const status = await Trip.aggregate([
                    {
                        $match: {
                            quest_state: "done",
                        },
                    },
                    {
                        $lookup: {
                            from: "magic_movers",
                            localField: "magic_mover_id",
                            foreignField: "_id",
                            as: "magic_mover",
                        },
                    },
                    {
                        $unwind: "$magic_mover",
                    },
                    {
                        $match: {
                            "magic_mover.user_id": user._id,
                        },
                    },
                    {
                        $group: {
                            _id: "$quest_state",
                            count: { $sum: 1 },
                        },
                    },
                ]);
                return {
                    ...user,
                    countComplatedMissions: status.length ? status[0].count : 0,
                };
            })
        );
        response = response.sort(
            (a: any, b: any) =>
                b.countComplatedMissions - a.countComplatedMissions
        );

        sendHttpResponse(req, res, response);
    },
};
