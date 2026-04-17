import { createClient } from "redis";
import { REDIS_URL } from "../../config/config.service.js";


export const redisClient = createClient({
        url:REDIS_URL
})


export const checkRedisConnection =async ()=>{
    try {
        await redisClient.connect()
        console.log("Redis connection Seccssefully........");
    } catch (error) {
        console.log(error,"Failed to connect Redis");
    }
}