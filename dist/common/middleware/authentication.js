import { AppError } from "../utils/global-error-handler.js";
import { ACCESS_TOKEN_KEY, PREFIX } from "../../config/config.service.js";
import { VerfiyToken } from "../utils/token.service.js";
import userRepository from "../../DB/repositories/user.repository.js";
import { get, revoked_token } from "../../DB/redis/redis.service.js";
export const Authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError("Token Not Found");
    }
    const [prefix, token] = authorization.split(" ");
    if (prefix !== PREFIX) {
        throw new AppError("inValid Prefix");
    }
    const decoded = VerfiyToken({ token: token, secretOrPublicKey: ACCESS_TOKEN_KEY });
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        throw new AppError("inValid token payload");
    }
    const user = await new userRepository().findOne({ filter: { _id: decoded.id } });
    if (!user) {
        throw new AppError("User Not Found", 409);
    }
    if (user.changeCredential?.getTime() > decoded.iat * 1000) {
        throw new AppError("inValid Token");
    }
    const revoked_token_value = await get(revoked_token({ userId: decoded.id, jti: decoded.jti }));
    if (revoked_token_value) {
        throw new AppError("inValid Token revoked");
    }
    req.user = user;
    req.decoded = decoded;
    next();
};
