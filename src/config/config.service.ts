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
export const REFRESH_TOKEN_KEY :string = process.env.REFRESH_TOKEN_KEY!
export const ACCESS_TOKEN_KEY :string = process.env.ACCESS_TOKEN_KEY!
export const PREFIX :string = process.env.PREFIX!
export const CLIENT_ID :string = process.env.CLIENT_ID!

