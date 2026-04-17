import userModel from "../model/user.model.js";
import baseRepository from "./base.repository.js";
class userRepository extends baseRepository {
    model;
    constructor(model = userModel) {
        super(userModel);
        this.model = model;
    }
}
export default userRepository;
