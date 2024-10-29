import { ArabicString } from "arabic-utils";
let removeDiacritics = (value: string): string => {
    let removedDiacritics = ArabicString(value).removeDiacritics();

    return removedDiacritics;
};
export { removeDiacritics };
