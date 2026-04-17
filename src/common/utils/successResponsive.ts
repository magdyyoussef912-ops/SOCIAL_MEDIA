import  express  from 'express';


export const successResponse = ({res,status,message,data}:{res: express.Response,status?:number, message: string, data?: any}) => {
    return res.status(status || 201).json({message :message||"done", data})   
}


