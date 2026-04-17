import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer/index.js";
import { EMAIL, PASSWORD } from "../../../config/config.service.js";


export const sendEmail = async (
    mailOptions: Mail.Options
)=>{
    const transporter = nodemailer.createTransport({
    service:"gmail",
    tls:{
        rejectUnauthorized:false
    },
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
    });
    const info = await transporter.sendMail({
        from: `"SOCAIAL_APP" <${EMAIL}>`,
        ...mailOptions
    });

    console.log("Message sent:", info.messageId);
    return info.accepted.length > 0 ? true : false  
}


export const generateOtp = async()=>{
    return Math.floor(Math.random()*900000+100000)
}



