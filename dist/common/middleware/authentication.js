import { AppError } from "../utils/global-error-handler.js";
import { ACCESS_TOKEN_KEY_ADMIN, ACCESS_TOKEN_KEY_USER, PREFIX_ADMIN, PREFIX_USER } from "../../config/config.service.js";
import { VerfiyToken } from "../utils/token.service.js";
import userRepository from "../../DB/repositories/user.repository.js";
import redisService from "../service/redis.service.js";
const userModel = new userRepository();
export const Authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError("Token Not Found");
    }
    const [prefix, token] = authorization.split(" ");
    if (!token) {
        throw new AppError("token Not Found");
    }
    let ACCESS_TOKEN_KEY = "";
    if (prefix == PREFIX_USER) {
        ACCESS_TOKEN_KEY = ACCESS_TOKEN_KEY_USER;
    }
    else if (prefix == PREFIX_ADMIN) {
        ACCESS_TOKEN_KEY = ACCESS_TOKEN_KEY_ADMIN;
    }
    else {
        throw new AppError("inValid Prefix");
    }
    const decoded = VerfiyToken({ token, secretOrPublicKey: ACCESS_TOKEN_KEY });
    if (!decoded?.id) {
        throw new AppError("inValid token payload");
    }
    const user = await userModel.findOne({ filter: { _id: decoded.id, confirmed: true } });
    if (!user) {
        throw new AppError("User Not Found", 409);
    }
    if (user.changeCredential?.getTime() > decoded.iat * 1000) {
        throw new AppError("inValid Token");
    }
    const revoked_token_value = await redisService.get(redisService.revoked_token({ userId: decoded.id, jti: decoded.jti }));
    if (revoked_token_value) {
        throw new AppError("inValid Token revoked");
    }
    req.user = user;
    req.decoded = decoded;
    next();
};
