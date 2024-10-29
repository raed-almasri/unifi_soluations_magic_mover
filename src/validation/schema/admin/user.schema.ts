import Joi from "joi";
import { getRegular } from "../../../utils/regularExpression.js";
import { getErrorMessages, message } from "../../../utils/getMessageError.js";

export const schema = {
    body: Joi.object({
        name: Joi.string().max(50).messages(getErrorMessages("name")),
        email: Joi.string()
            .trim()
            .pattern(getRegular("email"))
            .min(3)
            .max(50)
            .required()
            .messages(getErrorMessages("email")),
        password: Joi.string()
            .min(8)
            .max(50)
            .messages(getErrorMessages("password")),
    }),
    params: Joi.object({
        id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("id")),
    }),
    userId: Joi.object({
        user_id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages(getErrorMessages("user_id")),
    }),
    query: Joi.object({}),
    empty: Joi.object({}),
};
