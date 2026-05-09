
import { Model } from "mongoose";
import baseRepository from "./base.repository.js";
import postModel, { IPost } from "../model/post.model.js";






class postRepository extends baseRepository<IPost> {


    constructor(protected readonly model:Model<IPost>=postModel){
        super(postModel)
    }



}

export default postRepository

