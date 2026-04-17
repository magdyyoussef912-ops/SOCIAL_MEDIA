import { AppError } from "../utils/global-error-handler.js";
export const authorization = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError("unAuthorized");
        }
        next();
    };
};
