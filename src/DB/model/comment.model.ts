import mongoose, { Document, Types } from "mongoose";



export interface IComment {
    content: string,
    createdBy: Types.ObjectId,
    likes: Types.ObjectId[],
    postId : Types.ObjectId
}


const commentSchema = new mongoose.Schema<IComment>({
    content: {
        type: String,
        required: true,
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
    postId: {
        type: Types.ObjectId,
        ref: "post",
        required: true,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true,
    strict: true
})




const commentModel = mongoose.models.comment || mongoose.model<IComment>("comment", commentSchema)  

export default commentModel;