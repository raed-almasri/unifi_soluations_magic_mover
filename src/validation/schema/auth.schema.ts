import Joi from "joi";

import { getErrorMessages, message } from "../../utils/getMessageError.js";
export const schema = {
    logIn: Joi.object({
        email: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required()
            .messages(getErrorMessages("email")),
        password: Joi.string()
            .min(8)
            .max(50)
            .messages(getErrorMessages("password")),
    }),
};
