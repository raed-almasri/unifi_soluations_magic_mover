import _ from "lodash";
import { StatusCodes } from "http-status-codes";
// MODELS
import MagicMover from "../../models/magic_mover.model.js";
import MoverLogs from "../../models/mover_logs.model.js";
import MagicItems from "../../models/magic_item.model.js";
import Trips from "../../models/trips.model.js";
import { TripAttributes } from "../../models/trips.model.js";
import { enumState } from "../../utils/enums.js";
import { Request, Response } from "express";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
import { ITripWithMagicMover } from "../../interfaces/index.js";
type EnumStateType = keyof typeof enumState;
export default {
    create: async (req: Request, res: Response): Promise<void> => {
        if (
            !(await MagicMover.findOne({
                _id: req.body.mover_id,
                user_id: req.user.id,
            }).select("_id"))
        )
            throw new Error(req.getLocalLanguage("error.item.not_found"));
        let check: TripAttributes | null = await Trips.findOne({
            name: req.body.name.trim(),
            magic_mover_id: req.body.mover_id,
        }).select("_id");
        if (check) throw new Error(req.getLocalLanguage("error.trip.founded"));

        let createdTrip: TripAttributes | null = await Trips.create({
            ...req.body,
            magic_mover_id: req.body.mover_id,
            quest_state: enumState.init,
        });
        await MoverLogs.create({
            state: enumState.init as EnumStateType,
            trip_id: createdTrip._id,
        });

        sendHttpResponse(req, res, null, StatusCodes.CREATED);
    },
    update: async (req: Request, res: Response): Promise<void> => {
        let check: TripAttributes | any = await Trips.findOne({
            _id: req.params.id,
            magic_mover_id: {
                $exists: true,
            },
        })
            .select("_id")
            .populate({
                path: "magic_mover_id",
                match: {
                    user_id: req.user.id,
                },
                select: "_id",
            });
        if (!check)
            throw new Error(req.getLocalLanguage("error.trip.not_found"));

        if (
            !(await MagicMover.findOne({
                _id: req.body.mover_id,
                user_id: req.user.id,
            }).select("_id"))
        )
            throw new Error(req.getLocalLanguage("error.item.not_found"));

        check = await Trips.findOne({
            name: req.body.name.trim(),
            magic_mover_id: req.body.mover_id,
            _id: { $ne: req.params.id },
        }).select("_id");
        if (check) throw new Error(req.getLocalLanguage("error.trip.founded"));

        await Trips.updateOne(
            {
                _id: req.params.id,
            },
            { ...req.body, magic_mover_id: req.body.mover_id }
        );
        sendHttpResponse(req, res);
    },
    remove: async (req: Request, res: Response): Promise<void> => {
        let check: any = await Trips.findOne({
            _id: req.params.id,
            magic_mover_id: {
                $exists: true,
            },
        })
            .select("_id")
            .populate({
                path: "magic_mover_id",
                match: {
                    user_id: req.user.id,
                },
                select: "_id",
            });
        if (!check)
            throw new Error(req.getLocalLanguage("error.trip.not_found"));
        await Trips.deleteOne({ _id: req.params.id });

        sendHttpResponse(req, res);
    },
    fetchAll: async (req: Request, res: Response): Promise<void> => {
        let response: TripAttributes | any = await Trips.find({
            magic_mover_id: {
                $exists: true,
            },
        })
            .select("-magic_mover_id")
            .populate({
                path: "magic_mover_id",
                select: "-user_id",
                match: { user_id: req.user.id },
            })
            .lean();

        response = await Promise.all(
            response.map(async (trip: TripAttributes): Promise<void> => {
                let magic_items = await MagicItems.find({
                    trip_id: trip._id,
                }).select("_id name weight createdAt");

                let mover_info = trip.magic_mover_id;
                let tripInfo: any = trip;
                delete tripInfo.magic_mover_id;
                return {
                    ...tripInfo,
                    mover_info,
                    magic_items,
                };
            })
        );

        sendHttpResponse(req, res, response);
    },
    changeState: async (req: Request, res: Response): Promise<void> => {
        let moverId: string;
        let state: string;
        let tripId: string;
        if (req.query.mover_id && typeof req.query.mover_id === "string") {
            moverId = req.query.mover_id;
        } else throw new Error("user_id is required");

        if (req.query.trip_id && typeof req.query.trip_id === "string") {
            tripId = req.query.trip_id;
        } else throw new Error("trip_id is required");

        if (req.query.state && typeof req.query.state === "string") {
            state = req.query.state;
        } else throw new Error("state is required");

        //! check if a mover and a trip for this mover user
        if (
            !(await MagicMover.findOne({
                _id: moverId,
                user_id: req.user.id,
            }).select("_id"))
        )
            throw new Error(req.getLocalLanguage("error.item.not_found"));

        let check: TripAttributes | any = await Trips.findOne({
            magic_mover_id: moverId,
            _id: req.query.trip_id,
        }).select("_id quest_state");
        if (!check)
            throw new Error(req.getLocalLanguage("error.trip.not_found"));

        if (req.query.state && check.quest_state == req.query.state)
            throw new Error(
                req.getLocalLanguage("error.trip.must_change_state")
            );

        // if state is on mission then can't load any more items
        if (
            (check.quest_state == enumState.on_mission &&
                req.query.state == enumState.loading) ||
            (check.quest_state == enumState.done &&
                req.query.state != enumState.done)
        )
            throw new Error(req.getLocalLanguage("error.trip.failed"));

        // if there is any other trip work
        if (
            await Trips.findOne({
                _id: { $ne: req.query.trip_id },
                quest_state: { $in: ["resting", "loading", "on_mission"] },
                magic_mover_id: {
                    $exists: true,
                },
            }).populate({
                path: "magic_mover_id",
                match: { _id: moverId },
                select: "_id",
            })
        )
            throw new Error(req.getLocalLanguage("error.trip.another_work"));

        await Trips.updateOne(
            { _id: req.query.trip_id },
            { quest_state: req.query.state as EnumStateType }
        );
        await MoverLogs.create({
            state: state as EnumStateType,
            trip_id: tripId,
        });

        sendHttpResponse(req, res);
    },
};
