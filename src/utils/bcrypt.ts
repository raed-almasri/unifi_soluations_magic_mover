import dotenv from "dotenv";
dotenv.config({ path: `./.env` });
import bcryptJs from "bcryptjs";
export let bcrypt = (password: string): string => {
    const salt = bcryptJs.genSaltSync(12);
    return bcryptJs.hashSync(password, salt);
};

export let compare = async (
    password: string,
    validPassword: string
): Promise<boolean> => await bcryptJs.compare(password, validPassword);
