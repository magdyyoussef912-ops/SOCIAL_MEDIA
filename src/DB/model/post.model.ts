import mongoose, { Document, Types } from "mongoose";
import { AllowCommentEnum, AvailabiltyEnum } from "../../common/enum/post.enum.js";



export interface IPost {
    content?:string,
    attachments?:string[],
    createdBy: Types.ObjectId,
    likes: Types.ObjectId[],
    tags?:Types.ObjectId[],
    allowComents?:AllowCommentEnum
    availabilty?:AvailabiltyEnum
    folderId:string
}


const postSchema = new mongoose.Schema<IPost>({
    content:{
        type:String,
        maxlength:1000,
        minlength:1,
        required:function(this:IPost){
            return !this.attachments?.length
        },
        trim:true
    },
    attachments:[String],
    createdBy:{
        type:Types.ObjectId,
        ref:"user",
        required:true
    },
    likes:{
        type:[Types.ObjectId],
        ref:"user"
    },
    tags:{
        type:[Types.ObjectId],
        ref:"user"
    },
    allowComents:{
        type:String,
        enum:AllowCommentEnum,
        default:AllowCommentEnum.Allow
    },
    availabilty:{
        type:String,
        enum:AvailabiltyEnum,
        default:AvailabiltyEnum.Public
    },
    folderId:String
},{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    strictQuery: true,
    strict: true
})

postSchema.virtual("comments",{
    ref : "comment",
    localField:"_id",
    foreignField:"refId"
})




const postModel = mongoose.models.post || mongoose.model<IPost>("post", postSchema)  

export default postModel;