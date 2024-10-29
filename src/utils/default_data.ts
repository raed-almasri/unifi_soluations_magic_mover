import Users from "../models/user.model.js";
import { enumRoles } from "./enums.js";

export default async () => {
    type EnumRoles = keyof typeof enumRoles;
    if (!(await Users.find()))
        await Users.create({
            name: "Administrator",
            email: "admin@gmail.com",
            password: "Test@1234",
            role: enumRoles.admin as EnumRoles,
            verification_email: true,
        });
};
