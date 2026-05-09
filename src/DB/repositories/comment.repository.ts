
import { Model } from "mongoose";
import baseRepository from "./base.repository.js";
import postModel, { IPost } from "../model/post.model.js";
import commentModel, { IComment } from "../model/comment.model.js";






class commentRepository extends baseRepository<IComment> {


    constructor(protected readonly model:Model<IComment>=commentModel){
        super(commentModel) 
    }



}

export default commentRepository

