
import { redisClient } from "./connectionRedis.js"



export const revoked_token = ({userId,jti}:{userId:string,jti:string})=>{
    return `revoke_token::${userId}::${jti}`
}

export const revoked_id_token = ({userId}:{userId:string})=>{
    return `revoke_token::${userId}`
}

export const otp_key = ({email,subject}:{email:string,subject:string})=>{
    return `otp::${email}::${subject}`
}

export const max_otp_key = ({email}:{email:string})=>{
    return `otp::${email}::max_tries`
}

export const block_otp_key = ({email}:{email:string})=>{
    return `otp::${email}::block`
}

export const max_pass_key = ({email}:{email:string})=>{
    return `password::${email}::max_tries_password`
}


export const block_pass_key = ({email}:{email:string})=>{
    return `password::${email}::block_password`
}



// export const FA_key = ({email}:{email:string})=>{
//     return `2FA::${email}`
// }

// export const login_key = ({email}:{email:string})=>{
//     return `login_key::${email}`
// }


export  const  setValue = async ({key,value,ttl}:{key:string,value:string|number,ttl?:number})=>{
    try {
        // const data = typeof(value) == "string" ? value : JSON.stringify(value)
        return  ttl ? await redisClient.set(key,value,{EX:ttl}) :  await redisClient.set(key,value)
    } catch (error) {
        console.log(error,"fail to set operation");        
    }
}

export  const  update = async ({key,value}:{key:string,value:string})=>{
    try {
        if(!await redisClient.exists(key)) return 0
        return await setValue({key,value})
    } catch (error) {
        console.log(error,"fail to set operation");        
    }
}

export  const  get = async (key:string)=>{
    try {
        return await redisClient.get(key)
    } catch (error) {
        console.log(error,"fail to set operation");        
    }
}

export  const  ttl = async (key:string)=>{
    try {
        return await redisClient.ttl(key)
    } catch (error) {
        console.log(error,"fail to ttl operation");        
    }
}

export  const  exists = async (key:string)=>{
    try {
        return await redisClient.exists(key)
    } catch (error) {
        console.log(error,"fail to exists operation");        
    }
}

export  const  expire = async ({key,ttl}:{key:string,ttl:number})=>{
    try {
        return await redisClient.expire(key,ttl)
    } catch (error) {
        console.log(error,"fail to expire operation");        
    }
}

export  const  del = async (key:string)=>{
    try {
        if (!key.length) return 0
        return await redisClient.del(key)
    } catch (error) {
        console.log(error,"fail to del operation");        
    }
}

export  const  keys = async (pattern:string)=>{
    try {
        return await redisClient.keys(`${pattern}*`)
    } catch (error) {
        console.log(error,"fail to keys operation");        
    }
}

export  const  Incr = async (pattern:string)=>{
    try {
        return await redisClient.incr(pattern)
    } catch (error) {
        console.log(error,"fail to Incr operation");        
    }
}
