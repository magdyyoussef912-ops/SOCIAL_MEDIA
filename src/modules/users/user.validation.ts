import  * as z from "zod"
import { GenderEnum } from "../../common/enum/user.enum.js"



export const updateUserSchema = {
    body:z.object({
        address:z.string().optional(),
        age:z.number().optional(),
        gender:z.enum(GenderEnum).optional(),
        phone:z.string().optional(),
        firstName:z.string().optional(),
        lastName:z.string().optional(),
    })
}

export const updatePasswordSchema = {
    body:z.object({
        oldPassword:z.string(),
        newPassword:z.string(),
        confirmPassword:z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
}