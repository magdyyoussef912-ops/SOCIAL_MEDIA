import { createClient } from "redis";
import { REDIS_URL } from "../../config/config.service.js";
class RedisClient {
    Client;
    constructor() {
        this.Client = createClient({
            url: REDIS_URL
        });
        this.EventHandler();
    }
    EventHandler() {
        this.Client.on("error", (error) => {
            console.log(error, "Failed to connect Redis");
        });
    }
    async connect() {
        await this.Client.connect();
        console.log("Redis connection Seccssefully........");
    }
    revoked_token = ({ userId, jti }) => {
        return `revoke_token::${userId}::${jti}`;
    };
    revoked_id_token = ({ userId }) => {
        return `revoke_token::${userId}`;
    };
    otp_key = ({ email, subject }) => {
        return `otp::${email}::${subject}`;
    };
    max_otp_key = ({ email }) => {
        return `otp::${email}::max_tries`;
    };
    block_otp_key = ({ email }) => {
        return `otp::${email}::block`;
    };
    max_pass_key = ({ email }) => {
        return `password::${email}::max_tries_password`;
    };
    block_pass_key = ({ email }) => {
        return `password::${email}::block_password`;
    };
    setValue = async ({ key, value, ttl }) => {
        try {
            const data = typeof (value) == "string" ? value : JSON.stringify(value);
            return ttl ? await this.Client.set(key, data, { EX: ttl }) : await this.Client.set(key, data);
        }
        catch (error) {
            console.log(error, "fail to set operation");
        }
    };
    update = async ({ key, value }) => {
        try {
            if (!await this.Client.exists(key))
                return 0;
            return await this.setValue({ key, value });
        }
        catch (error) {
            console.log(error, "fail to set operation");
        }
    };
    get = async (key) => {
        try {
            try {
                return JSON.parse(await this.Client.get(key));
            }
            catch (error) {
                return await this.Client.get(key);
            }
        }
        catch (error) {
            console.log(error, "fail to set operation");
        }
    };
    ttl = async (key) => {
        try {
            return await this.Client.ttl(key);
        }
        catch (error) {
            console.log(error, "fail to ttl operation");
        }
    };
    exists = async (key) => {
        try {
            return await this.Client.exists(key);
        }
        catch (error) {
            console.log(error, "fail to exists operation");
        }
    };
    expire = async ({ key, ttl }) => {
        try {
            return await this.Client.expire(key, ttl);
        }
        catch (error) {
            console.log(error, "fail to expire operation");
        }
    };
    del = async (key) => {
        try {
            if (!key.length)
                return 0;
            return await this.Client.del(key);
        }
        catch (error) {
            console.log(error, "fail to del operation");
        }
    };
    keys = async (pattern) => {
        try {
            return await this.Client.keys(`${pattern}*`);
        }
        catch (error) {
            console.log(error, "fail to keys operation");
        }
    };
    Incr = async (pattern) => {
        try {
            return await this.Client.incr(pattern);
        }
        catch (error) {
            console.log(error, "fail to Incr operation");
        }
    };
}
export default new RedisClient();
