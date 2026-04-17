import { AppError } from "../utils/global-error-handler.js";
export const Validation = (schema) => {
    return (req, res, next) => {
        let validationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                result.error.issues.forEach((element) => {
                    validationError.push({
                        path: element.path[0],
                        message: element.message
                    });
                });
            }
        }
        if (validationError.length > 0) {
            throw new AppError(JSON.parse(JSON.stringify(validationError)), 400);
        }
        next();
    };
};
