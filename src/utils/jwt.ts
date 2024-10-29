import Jwt from "jsonwebtoken";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

const secretKey = Buffer.from(process.env.SECRET_KEYEncrypted || "", "hex");

export let verifyToken = (token: string, SECRET_KEY: string) => {
    const decoded: any = Jwt.verify(token, SECRET_KEY);
    if (!decoded || !decoded.hasOwnProperty("encrypted")) {
        throw new Error("Invalid token");
    }

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );
    let decrypted = decipher.update(decoded.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    // Parse the decrypted payload
    return JSON.parse(decrypted);
};

export let generateToken = (
    payload: any,
    SECRET_KEY: string,
    expiresIn: string
) => {
    const payloadStr = JSON.stringify(payload);

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );

    let encrypted = cipher.update(payloadStr, "utf8", "hex");
    encrypted += cipher.final("hex");

    return Jwt.sign(
        {
            encrypted,
        },
        SECRET_KEY,
        {
            expiresIn,
        }
    );
};
