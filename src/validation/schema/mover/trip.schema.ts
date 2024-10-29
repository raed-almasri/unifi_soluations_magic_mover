import Joi from "joi";
import { getErrorMessages, message } from "../../../utils/getMessageError.js";
import { enumState } from "../../../utils/enums.js";

export const schema = {
    body: Joi.object({
        name: Joi.string().min(8).max(50).messages(getErrorMessages("name")),
        mover_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("mover_id")),
    }),
    params: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("id")),
    }),
    query: Joi.object({}),
    empty: Joi.object({}),
    queryValidation: Joi.object({
        trip_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("trip_id")),
        mover_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("mover_id")),
        state: Joi.string()
            .valid(
                enumState.resting,
                enumState.loading,
                enumState.on_mission,
                enumState.done
            )
            .required()
            .messages(getErrorMessages("state")),
    }),
    queryValidationUser: Joi.object({
        user_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("user_id")),
    }),
};
