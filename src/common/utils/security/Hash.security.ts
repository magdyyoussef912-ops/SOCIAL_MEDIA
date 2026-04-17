import {compareSync,hashSync} from "bcrypt"
import { SALTROUNDS } from './../../../config/config.service.js';


export const Hash = ({plainText,saltRounds=SALTROUNDS}:{plainText:string,saltRounds?:number}):string=>{
    return hashSync(plainText.toString(),Number(saltRounds) )
}

export const Compare = ({plainText,cipherText}:{plainText:string,cipherText:string}):boolean=>{
    return compareSync(plainText,cipherText)
}