import mongoose, { Document, Types } from "mongoose";
import { onModelEnum } from "../../common/enum/post.enum.js";
import { required } from "zod/mini";



export interface IComment {
    content: string,
    createdBy: Types.ObjectId,
    likes: Types.ObjectId[],
    attachments?:string[],
    tags?:Types.ObjectId[],
    folderId:string
    refId : Types.ObjectId
    commentId:Types.ObjectId,
    onModel:onModelEnum
}


const commentSchema = new mongoose.Schema<IComment>({
    content: {
        type: String,
        required: true,
        minLength:1,
        maxlength: 500,
        trim: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true,
    },
    likes: {
        type: [Types.ObjectId],
        ref: "user",
    },
    tags: {
        type: [Types.ObjectId],
        ref: "user",
    },
    folderId:String,
    attachments:[String],
    refId: {
        type: Types.ObjectId,
        refPath: "onModel",
        required: true,
    },
    onModel:{
        type: String,
        enum:onModelEnum,
        required:true
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
    strict: true
})

commentSchema.virtual("replies",{
    ref:"comment",
    localField:"_id",
    foreignField:"refId"
})


const commentModel = mongoose.models.comment || mongoose.model<IComment>("comment", commentSchema)  

export default commentModel;