import { compareSync, hashSync } from "bcrypt";
import { SALTROUNDS } from './../../../config/config.service.js';
export const Hash = ({ plainText, saltRounds = SALTROUNDS }) => {
    return hashSync(plainText.toString(), Number(saltRounds));
};
export const Compare = ({ plainText, cipherText }) => {
    return compareSync(plainText, cipherText);
};
