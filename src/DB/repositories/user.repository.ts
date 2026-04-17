
import { Model } from "mongoose";
import userModel, { IUser } from "../model/user.model.js";
import baseRepository from "./base.repository.js";






class userRepository extends baseRepository<IUser> {


    constructor(protected readonly model:Model<IUser>=userModel){
        super(userModel)
    }



}

export default userRepository

