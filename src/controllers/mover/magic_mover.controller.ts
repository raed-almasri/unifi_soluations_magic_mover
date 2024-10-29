import _ from "lodash";
// MODELS
import MagicMover, {
    MagicMoverAttributes,
} from "../../models/magic_mover.model.js";
import { Request, Response } from "express";
import { sendHttpResponse } from "../../utils/HttpResponse.js";
export default {
    fetchAllMyMover: async (req: Request, res: Response): Promise<void> => {
        let response: MagicMoverAttributes[] = await MagicMover.find({
            user_id: req.user.id,
        }).select("_id weight energy createdAt");
        sendHttpResponse(req, res, response);
    },
};
