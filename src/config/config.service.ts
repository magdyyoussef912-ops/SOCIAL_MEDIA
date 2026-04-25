import dotenv from 'dotenv'
import {resolve} from 'path'

const NODE_ENV = process.env.NODE_ENV 

dotenv.config({path: resolve(process.cwd(),`.env.${NODE_ENV}`)})


export const PORT : number = Number(process.env.PORT) || 3000
export const LOCAL_URI_DB :string = process.env.LOCAL_URI_DB!
export const SALTROUNDS :number = Number(process.env.SALTROUNDS)
export const EMAIL :string = process.env.EMAIL!
export const PASSWORD :string = process.env.PASSWORD!
export const REDIS_URL :string = process.env.REDIS_URL!
export const REFRESH_TOKEN_KEY_USER :string = process.env.REFRESH_TOKEN_KEY_USER!
export const REFRESH_TOKEN_KEY_ADMIN :string = process.env.REFRESH_TOKEN_KEY_ADMIN!
export const ACCESS_TOKEN_KEY_ADMIN :string = process.env.ACCESS_TOKEN_KEY_ADMIN!
export const ACCESS_TOKEN_KEY_USER :string = process.env.ACCESS_TOKEN_KEY_USER!
export const PREFIX_ADMIN :string = process.env.PREFIX_ADMIN!
export const PREFIX_USER :string = process.env.PREFIX_USER!
export const CLIENT_ID :string = process.env.CLIENT_ID!

