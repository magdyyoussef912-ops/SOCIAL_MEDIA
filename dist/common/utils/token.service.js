import jwt from "jsonwebtoken";
export const GenerateToken = ({ payload, secretOrPrivateKey, options = {} }) => {
    return jwt.sign(payload, secretOrPrivateKey, options);
};
export const VerfiyToken = ({ token, secretOrPublicKey, options }) => {
    return jwt.verify(token, secretOrPublicKey, options);
};
