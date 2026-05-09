
import { NextFunction, Request, Response } from "express"
import {  ZodType } from "zod" 
import { AppError } from "../utils/global-error-handler.js"


type reqType = keyof Request
type schemaType = Partial< Record<reqType,ZodType>>

export const Validation = (schema:schemaType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        let validationError : { path: string | number; message: string }[] = []
        for (const key of Object.keys(schema) as reqType[]) {
            if (!schema[key]) continue
            if (req?.file) {
                req.body.attachment = req.file
            }
            if (req?.files) {
                req.body.attachments = req.files
            }
            const result = schema[key].safeParse(req[key])
            if (!result.success) {
                result.error.issues.forEach((element) =>{
                    validationError.push({
                        path:element.path[0] as string,
                        message:element.message
                    })
                })
            }
        }
        if (validationError.length > 0) {
            throw new AppError(JSON.parse(JSON.stringify(validationError)) , 400)
        }
        next()  
    }
}