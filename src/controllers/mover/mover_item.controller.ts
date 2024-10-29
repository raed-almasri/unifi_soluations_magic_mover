import _ from "lodash";
import { StatusCodes } from "http-status-codes";
// MODELS
import MoverLogs from "../../models/mover_logs.model.js";
import MagicItems from "../../models/magic_item.model.js";
import Trips from "../../models/trips.model.js";
import mongoose from "mongoose";
import { enumState } from "../../utils/enums.js";
import { Request, Response } from "express";
import { ITripWithMagicMover } from "../../interfaces/index.js";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
type EnumStateType = keyof typeof enumState;
export default {
    create: async (req: Request, res: Response): Promise<void> => {
        let check: ITripWithMagicMover | any = await Trips.findOne({
            _id: req.body.trip_id,
            magic_mover_id: {
                $exists: true,
            },
        })
            .select("_id")
            .populate({
                path: "magic_mover_id",
                match: { user_id: req.user.id },
                select: "_id weight energy",
            })
            .lean();
        if (!check)
            throw new Error(req.getLocalLanguage("error.trip.not_found"));

        if (
            await MagicItems.findOne({
                name: req.body.name.trim(),
                trip_id: req.body.trip_id.trim(),
            }).select("_id")
        )
            throw new Error(req.getLocalLanguage("error.item.founded"));

        const tripExists: ITripWithMagicMover | any = await Trips.findOne({
            _id: { $ne: req.body.trip_id },
            $or: [
                { quest_state: "resting" },
                { quest_state: "loading" },
                { quest_state: "on_mission" },
            ],
            "magic_mover_id.user_id": req.user.id,
        }).populate({
            path: "magic_mover_id",
            select: "_id",
        });

        if (tripExists) {
            throw new Error(req.getLocalLanguage("error.trip.another_work"));
        }
        const tripId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
            req.body.trip_id
        );

        const weight_all = await MagicItems.aggregate()
            .match({
                trip_id: tripId,
            })
            .group({ _id: "$trip_id", totalWeight: { $sum: "$weight" } });

        if (
            weight_all.length === 0 ||
            (check.magic_mover_id &&
                req.body.weight <=
                    check?.magic_mover_id?.weight - weight_all[0].totalWeight &&
                req.body.weight < check?.magic_mover_id?.energy)
        ) {
            await MagicItems.create({
                ...req.body,
            });

            await Trips.updateOne(
                { _id: req.body.trip_id },
                { quest_state: enumState.loading as EnumStateType }
            );

            await MoverLogs.create({
                state: enumState.loading as EnumStateType,
                trip_id: req.body.trip_id,
            });
        } else if (check?.magic_mover_id?.weight - weight_all[0].sum == 0)
            throw new Error(req.getLocalLanguage("error.item.full"));
        else throw new Error(req.getLocalLanguage("error.item.bigger_size"));

        sendHttpResponse(req, res, null, StatusCodes.CREATED);
    },
    remove: async (req: Request, res: Response): Promise<void> => {
        const check: ITripWithMagicMover | any = await MagicItems.findOne({
            _id: req.params.id,
            trip_id: { $exists: true },
        }).populate({
            path: "trip_id",
            select: "_id",
            match: { magic_mover_id: { $exists: true } },
            populate: {
                path: "magic_mover_id",
                match: { user_id: req.user.id },
                select: "_id weight energy quest_state",
            },
        });

        if (!check)
            throw new Error(req.getLocalLanguage("error.item.not_found"));

        await MagicItems.deleteOne({ _id: req.params.id });
        sendHttpResponse(req, res);
    },
};
