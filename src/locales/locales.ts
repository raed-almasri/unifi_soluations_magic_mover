import { Request, Response, NextFunction, Express } from "express";
import i18n from "i18n";
let myLanguages = ["ar", "en", "fr", "ja", "ru"];
export let localesLanguages = (app: Express) => {
    i18n.configure({
        locales: ["en", "ar", "fr", "ja", "ru"],
        directory: "./src/locales",
        defaultLocale: "en",
        objectNotation: true,
    });

    app.use(i18n.init);

    app.use((req: Request, res: Response, next: NextFunction) => {
        let langHeader = req.headers["accept-language"];
        let lang;

        if (Array.isArray(langHeader)) {
            lang = langHeader[0];
        } else {
            lang = langHeader;
        }
        if (lang) {
            let languages = lang
                .split(",")
                .map((l: string) => l.trim().toLowerCase());

            lang = languages[0] || languages[1];
        }
        if (!myLanguages.includes(lang)) lang = "en";

        req.setLocale(lang);
        req.getLocalLanguage = (key: string) => req.__(key);
        next();
    });
};
