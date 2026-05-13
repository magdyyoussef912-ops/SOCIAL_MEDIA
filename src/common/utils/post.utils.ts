import { Request } from "express"
import { AvailabiltyEnum } from "../enum/post.enum.js"





export const AvailabiltyPost = (req:Request)=>{
    return [
            {availabilty:AvailabiltyEnum.Public},
            {availabilty:AvailabiltyEnum.only_me,createdBy:req.user?._id!},
            {availabilty:AvailabiltyEnum.Friends, createdBy: { $in:  [ ...( req.user?.friends || [] ) , req.user?._id! ]  }},
            {tags: { $in: [ req.user?._id! ] } }
        ]
}