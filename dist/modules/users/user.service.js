import userRepository from "../../DB/repositories/user.repository.js";
import { decrypt } from "../../common/utils/security/dcrypt.security.js";
import { successResponse } from "../../common/utils/successResponsive.js";
class userRoutes {
    _userModel = new userRepository();
    constructor() { }
    getUser = async (req, res, next) => {
        const userName = req.user.userName;
        const age = req.user.age;
        const address = req.user.address;
        const gender = req.user.gender;
        const phone = decrypt(req.user.phone);
        const email = req.user.email;
        successResponse({ res, message: "done", data: { user: { userName, age, address, gender, phone, email } } });
    };
}
export default new userRoutes();
