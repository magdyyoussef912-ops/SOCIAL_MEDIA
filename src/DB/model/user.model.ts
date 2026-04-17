import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";
import { Document } from "mongoose";



export interface IUser extends Document  {
    firstName : string,
    lastName : string,
    userName : string,
    email : string,
    password : string,
    role : RoleEnum,
    confirmed: boolean
    system ?: ProviderEnum,
    phone?: string,
    provider?:ProviderEnum
    age ?: number,
    gender?: GenderEnum,
    address?: string,
    createdAt: Date,
    updatedAt: Date
    changeCredential:Date
}


const userSchema = new mongoose.Schema<IUser>({
    firstName :{
        type : String,
        required : [true, "first name is required"],
        trim : true,
        minLength : [3, "first name must be at least 3 characters"],
        maxLength : [10, "first name must be at most 10 characters"]
    },
    lastName :{
        type : String,
        required : [true, "last name is required"],
        trim : true,
        minLength : [3, "last name must be at least 3 characters"],
        maxLength : [10, "last name must be at most 10 characters"]
    },
    email:{
        type : String,
        email : true,
        required : [true, "email is required"],
        unique : true
    },
    password :{
        type : String,
        required  :function ():boolean {
            return this.provider == ProviderEnum.Google ? false : true
        },
        minLength : [8, "password must be at least 8 characters"],
    },
    role:{
        type: String,
        enum : Object.values(RoleEnum),
        default : RoleEnum.USER
    },
    provider:{
        type : String,
        enum: Object.values(ProviderEnum),
        default : ProviderEnum.System
    },
    confirmed : Boolean,
    phone : String,
    age : {
        type : Number,
        min : [18, "age must be at least 18"],
        max : [60, "age must be at most 60"]
    },
    gender:{
        type : String,
        enum: Object.values(GenderEnum),
        default : GenderEnum.Male
    },
    address : String,
    changeCredential:Date
},{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    strictQuery: true,
    strict: true
})

userSchema.virtual("userName")
    .get (function(){
        return this.firstName + " " + this.lastName;
    })
    .set(function(value: string){
        const [firstName, lastName] = value.split(" ")
        this.set({firstName, lastName})
    })



const userModel = mongoose.models.user || mongoose.model<IUser>("user", userSchema)  

export default userModel;