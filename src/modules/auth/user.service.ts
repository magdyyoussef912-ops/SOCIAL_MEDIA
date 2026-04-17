import { compareSync } from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../common/utils/successResponsive.js";
import { HydratedDocument, Model } from "mongoose";
import userModel, { IUser } from "../../DB/model/user.model.js";
import { Compare, Hash } from "../../common/utils/security/Hash.security.js";
import { ACCESS_TOKEN_KEY, CLIENT_ID, REFRESH_TOKEN_KEY, SALTROUNDS } from "../../config/config.service.js";
import { AppError } from "../../common/utils/global-error-handler.js";
import { encrypt } from "../../common/utils/security/dcrypt.security.js";
import { ISignUpType } from "./user.validation.js";
import { GenerateToken } from "../../common/utils/token.service.js";
import baseRepository from "../../DB/repositories/base.repository.js";
import userRepository from "../../DB/repositories/user.repository.js";
import { sendEmail,generateOtp } from "../../common/utils/email/sendEmail.js";
import { emailTemplate } from "../../common/utils/email/email.Template.js";
import { block_otp_key, block_pass_key, del, get, Incr, keys, max_otp_key, max_pass_key, otp_key, revoked_id_token, revoked_token, setValue, ttl } from "../../DB/redis/redis.service.js";
import { emailEnum, ProviderEnum } from "../../common/enum/user.enum.js";
import { sendEmailOtp } from "../../common/utils/email/sendEmailOtp.js";
import { eventEmitter } from "../../common/utils/email/email.events.js";
import { randomUUID } from "node:crypto";
import {OAuth2Client, TokenPayload} from "google-auth-library"
import { email, string } from 'zod';






class UserService {

    private readonly _userModel  = new userRepository()

    constructor () {}


    signUp = async (req: Request, res: Response, next: NextFunction) => {
        
        const {userName,email,password,cPassword,age,address,phone} : ISignUpType  = req.body

        if (password !== cPassword) {
            throw new AppError("inValid cPassword",409);
        }
        

        if (await this._userModel.findOne({filter:{email}})) {
            throw new AppError("User Already Exist",409)
        }

        const user : HydratedDocument<IUser> = await this._userModel.create({
            userName,
            email,
            password:Hash({plainText :password ,saltRounds:SALTROUNDS}),
            age,
            address,
            phone:encrypt(phone)
        })

        const otp :number = await generateOtp()
        eventEmitter.emit(emailEnum.confirmEmail,async ()=>{
            await sendEmail({to:email,subject:"Welcome in Social_App",html:emailTemplate(otp)})
        })


        await setValue({key:otp_key({email,subject:emailEnum.confirmEmail}),value:Hash({plainText:`${otp}`}),ttl:10*60})
        await setValue({key:max_otp_key({email}),value:1,ttl:30})

        successResponse({ res, message: "Sign Up successful",data:user })
    }

    confirmEmail = async (req: Request, res: Response, next: NextFunction)=>{
        const {email,code} = req.body

        const otpValue = await get(otp_key({email,subject:emailEnum.confirmEmail}))
        if (!otpValue) {
            throw new AppError("Otp Expired",409);            
        }

        if (!Compare({plainText:`${code}`,cipherText:otpValue})) {
            throw new AppError("inValid Otp",409);
        }

        const user = await this._userModel.findOneAndUpdate({
            filter:{email,confirmed:{$exists:false}},
            update:{confirmed:true}
        })
        if (!user) {
            throw new AppError("user Not Exist",409)
        }

        await del(otp_key({email,subject:emailEnum.confirmEmail}))

        successResponse({res,message:"Email Confirmed successfully"})

    }

    resendOtp = async  (req: Request, res: Response, next: NextFunction)=>{
        const {email} = req.body

        const user = await this._userModel.findOne({
            filter:{email,confirmed:{$exists:false}}
        })

        if (!user) {
            throw new AppError("user Not Exist",409)
        }

        await sendEmailOtp({email,subject:emailEnum.confirmEmail})

        successResponse({res,message:"Otp Sent"})
    }

    forgetPassword = async (req: Request, res: Response, next: NextFunction)=>{
        const {email} = req.body

        const user = await this._userModel.findOne({
            filter:{email,confirmed:{$exists:true}}
        })
        if (!user) {
            throw new AppError("User Not Found",409)
        }

        await sendEmailOtp({email,subject:emailEnum.forgetPassword})

        successResponse({res,message:"otp Sent"})
    }

    resetPassword = async  (req: Request, res: Response, next: NextFunction)=>{
        const {email,code,nPassword} = req.body

        const otpValue = await get(otp_key({email,subject:emailEnum.forgetPassword}))
        if (!otpValue) {
            throw new AppError("Otp Expired")
        }


        if (!Compare({plainText:`${code}`,cipherText:otpValue})) {
            throw new AppError("inValid Otp")
        }

        const user = await this._userModel.findOneAndUpdate({
            filter:{email,confirmed:{$exists:true}},
            update:{password:Hash({plainText:nPassword})}
        })
        if (!user) {
            throw new AppError("User Not Found",409)
        }

        await del(otp_key({email,subject:emailEnum.forgetPassword}))

        successResponse({res,message:"otp Sent successfully"})
    }

    signIn = async (req: Request, res: Response, next: NextFunction) => {
        const {email,password} = req.body
        
        const user = await this._userModel.findOne({
            filter:{email,confirmed:{$exists:true}}
        })
        if (!user) {
            throw new AppError("User Not Found or not confirmed ",409)
        }

        const block_password = await get(block_pass_key({email}))
        if (block_password !== null) {
            throw new AppError("Blocked try again after 5 minutes")
        }

        if (!Compare({plainText:password,cipherText:user.password})) {
            const max_tries_password =  await Incr(max_pass_key({email}))
            if (Number(max_tries_password) >= 5) {
                await setValue({key:block_pass_key({email}),value:1,ttl:5*60})
                throw new AppError("you have exceeded the maximum number of tries")                
            }
            throw new AppError("inValid Password",409)
        }

        const jwtid =  randomUUID()

        const access_token = GenerateToken({
            payload:{id:user._id ,email},
            secretOrPrivateKey:ACCESS_TOKEN_KEY,
            options:{
                expiresIn:60*2,
                jwtid
            }
        })

        const refresh_token = GenerateToken({
            payload:{id:user._id ,email},
            secretOrPrivateKey:REFRESH_TOKEN_KEY,
            options:{
                expiresIn:"1day",
                jwtid
            }
        })

        successResponse({ res, message: "Sign In successful",data:{access_token,refresh_token} })
    }

    SignUpWithGmail = async (req: Request, res: Response, next: NextFunction) => {
        const {idToken} = req.body
        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();

        const {name,email,email_verified} : TokenPayload  | undefined = payload!

        let user = await this._userModel.findOne({
            filter:{email:payload?.email!}
        })

        if (!user) {
            user = await this._userModel.create({
                    userName:name as string,
                    email:email as string,
                    confirmed:email_verified as boolean,
                    provider:ProviderEnum.Google
            })
        }

        if (user.provider == ProviderEnum.System) {
            throw new AppError("Plz log in with system",409)
        }

        const jwtid =  randomUUID()

        const access_token = GenerateToken({
            payload:{id:user._id , email : email as string },
            secretOrPrivateKey:ACCESS_TOKEN_KEY,
            options:{
                expiresIn:"1day",
                jwtid
            }
        })
        

        successResponse({ res, message: "Sign In successful",data:access_token })

    }

    updatePassword = async (req: Request, res: Response, next: NextFunction) => {
        const {password,nPassword} = req.body

        
        if (!Compare({plainText:password,cipherText:req.user.password})) {
            throw new AppError("inValid Password",409)
        }

        req.user.password = Hash({plainText:nPassword})
        req.user.changeCredential = new Date()
        await req.user.save()

        successResponse({res,message:"Password Updated....."})
    }


    logout = async (req: Request, res: Response, next: NextFunction) => {
        const {flag} = req.query

        if (flag === "All") {
            req.user!.changeCredential=new Date() as Date
            await req.user!.save()
            const revoked_tokens = await keys( revoked_id_token( {userId:req.decoded.id!} ) )
            if (revoked_tokens && revoked_tokens.length >0) {
                await Promise.all(revoked_tokens.map(key => del(key)))
            }
        }else{
            await setValue({
                key:revoked_token({userId:req.decoded.id!,jti:req.decoded.jti! }),
                value:`${req.decoded.jti}`,
                ttl: req.decoded.exp! - Math.floor(Date.now()/1000)
            })
        }
        await req.user.save()
        successResponse({res,message:"Log Out successfully"})
    }


}

export default new UserService();