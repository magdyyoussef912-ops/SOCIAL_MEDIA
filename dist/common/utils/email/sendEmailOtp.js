import { AppError } from "../global-error-handler.js";
import { generateOtp, sendEmail } from "./sendEmail.js";
import { emailTemplate } from "./email.Template.js";
import { Hash } from "../security/Hash.security.js";
import RedisClient from "../../../common/service/redis.service.js";
export const sendEmailOtp = async ({ email, subject }) => {
    const is_Blocked = await RedisClient.get(RedisClient.block_otp_key({ email }));
    if (is_Blocked !== null) {
        throw new AppError(`Blocked try again after 3 minutes`);
    }
    const TTlValue = await RedisClient.ttl(RedisClient.otp_key({ email, subject: subject }));
    if (Number(TTlValue) > 0 && TTlValue !== undefined) {
        throw new AppError(`Can't send otp after ${TTlValue} seconds`);
    }
    const max_tries = await RedisClient.get(RedisClient.max_otp_key({ email }));
    if (Number(max_tries) >= 3) {
        await RedisClient.setValue({ key: RedisClient.block_otp_key({ email }), value: 1, ttl: 3 * 60 });
        throw new AppError("you have exceeded the maximum number of tries");
    }
    const otp = await generateOtp();
    await sendEmail({ to: email, subject: "Welcome in Social_App", html: emailTemplate(otp) });
    await RedisClient.setValue({ key: RedisClient.otp_key({ email, subject: subject }), value: Hash({ plainText: `${otp}` }), ttl: 10 * 60 });
    await RedisClient.Incr(RedisClient.max_otp_key({ email }));
};
