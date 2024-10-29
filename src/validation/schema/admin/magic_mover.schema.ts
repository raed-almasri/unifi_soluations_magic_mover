import Joi from "joi";
import { getErrorMessages } from "../../../utils/getMessageError.js";

export const schema = {
    body: Joi.object({
        weight: Joi.number()
            .integer()
            .max(1e7)
            .required()
            .messages(getErrorMessages("weight")),
        energy: Joi.number()
            .integer()
            .max(1e7)
            .required()
            .messages(getErrorMessages("energy")),
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
        user_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("user_id")),
        mover_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("mover_id")),
    }),
    queryValidationUser: Joi.object({
        user_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("user_id")),
    }),
};
