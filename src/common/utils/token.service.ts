import {PrivateKey, PublicKey, Secret ,SignOptions, VerifyOptions} from "jsonwebtoken"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

export interface JwtPayload {
    id: mongoose.Types.ObjectId ;   
    email: string;  
    iat?: number;  
    exp?: number;  
    jti?: string;   
}


export const GenerateToken = ({payload,secretOrPrivateKey,options={}}:{payload:JwtPayload, secretOrPrivateKey: Secret | PrivateKey,options?: SignOptions})=>{
    return jwt.sign(payload,secretOrPrivateKey,options)
}

export const VerfiyToken = (
    {
    token,
    secretOrPublicKey,
    options
}:
    {token:string,
        secretOrPublicKey: Secret | PublicKey,
        options?: VerifyOptions
    })=>{
    return jwt.verify(token,secretOrPublicKey,options)
}