
import { block_otp_key, get, Incr, max_otp_key, otp_key, setValue, ttl } from "../../../DB/redis/redis.service.js";
import { AppError } from "../global-error-handler.js";
import { generateOtp, sendEmail } from "./sendEmail.js";
import { emailTemplate } from "./email.Template.js";
import { Hash } from "../security/Hash.security.js";




export const sendEmailOtp =async (
    {email,subject}:{email:string,subject:string}
)=>{


        const is_Blocked = await get(block_otp_key({email}))
        if (is_Blocked !== null) {
            throw new AppError(`Blocked try again after 3 minutes`)
        }
    
        const TTlValue = await ttl(otp_key({email,subject}))
        if ( Number(TTlValue) > 0 && TTlValue !== undefined) {
            throw new AppError(`Can't send otp after ${TTlValue} seconds`);
        }
    
        const max_tries  = await get(max_otp_key({email}))
        if (Number(max_tries) >=3 ) {
            await setValue({key:block_otp_key({email}),value:1,ttl:3*60})
            throw new AppError("you have exceeded the maximum number of tries")
        }
    
    
        const otp :number = await generateOtp()

        await sendEmail({to:email,subject:"Welcome in Social_App",html:emailTemplate(otp)})
    
    
        await setValue({key:otp_key({email,subject}),value:Hash({plainText:`${otp}`}),ttl:10*60})
        await Incr(max_otp_key({email}))


}