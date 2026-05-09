import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../../config/config.service.js";
import { randomUUID } from "node:crypto";
import { MulterStorageType } from "../enum/multer.enum.js";
import fs from "node:fs";
import { AppError } from "../utils/global-error-handler.js";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



export class S3Service {
    private client:S3Client


    constructor(){

        this.client = new S3Client({
            region: AWS_REGION,
            credentials:{
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            }
        });      
    }


    async uploadFile({
        file,
        storage_type=MulterStorageType.MEMORY,
        path="General",
        ACL=ObjectCannedACL.private
    }:{ 
        file:Express.Multer.File,
        storage_type?:MulterStorageType,
        path?:string,
        ACL?:ObjectCannedACL
    }) {

        const command = new PutObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            ACL,
            Key:`social_media_app/${path}/${randomUUID()}__${file.originalname}`,
            Body:storage_type === MulterStorageType.MEMORY ? file.buffer :fs.createReadStream(file.path),
            ContentType: file.mimetype
        });
        if (!command.input.Key) {
            throw new AppError("fail to upload file")
        }
        await this.client.send(command)
        return command.input.Key
    }

    async uploadLargeFile({
        file,
        storage_type=MulterStorageType.DISK,
        path="General",
        ACL=ObjectCannedACL.private
    }:{ 
        file:Express.Multer.File,
        storage_type?:MulterStorageType,
        path?:string,
        ACL?:ObjectCannedACL
    }) {

        const command = new Upload({
            client:this.client,
            params:{
                Bucket: AWS_BUCKET_NAME,
                ACL,
                Key:`social_media_app/${path}/${randomUUID()}__${file.originalname}`,
                Body:storage_type === MulterStorageType.MEMORY ? file.buffer :fs.createReadStream(file.path),
                ContentType: file.mimetype
            }
        });
        
        const result = await command.done()
        return result.Key
    }

    async uploadFiles({
        files,
        storage_type=MulterStorageType.MEMORY,
        path="General",
        ACL=ObjectCannedACL.private,
        isLarge=false
    }:{ 
        files:Express.Multer.File[],
        storage_type?:MulterStorageType,
        path?:string,
        ACL?:ObjectCannedACL,
        isLarge?:boolean
    }){
        let urls = []
        if (isLarge) {
            urls = await Promise.all(files.map((file:Express.Multer.File) => this.uploadLargeFile({ file, storage_type, path, ACL })))
        }else {
            urls = await Promise.all(files.map((file:Express.Multer.File) => this.uploadFile({ file, storage_type, path, ACL })))
        }
        

        return urls
    }

    async createPreSignedUrl ({
        fileName,
        path,
        ContentType,
        expiresIn=30
    }:{
        path:string,
        fileName:string,
        ContentType:string,
        expiresIn?:number
    }){
        const Key = `social_media_app/${path}/${randomUUID()}__${fileName}`
        const command = new PutObjectCommand({
            Bucket:AWS_BUCKET_NAME,
            Key,
            ContentType
        })

        const url = await getSignedUrl(this.client,command,{expiresIn})
        return {url,Key}
    }

    async getFile (Key:string){
        const command = new GetObjectCommand({
            Bucket:AWS_BUCKET_NAME,
            Key
        })
        return await this.client.send(command)
    }

    async getFiles (folderName:string){
        const command = new ListObjectsV2Command({
            Bucket:AWS_BUCKET_NAME,
            Prefix:`social_media_app/${folderName}`
        })
        return await this.client.send(command)
    }


    async deleteFile (Key:string){
        const command = new DeleteObjectCommand({
            Bucket:AWS_BUCKET_NAME,
            Key
        })
        return await this.client.send(command)
    }

    async deleteFiles (Keys:string[]){
        const keyMapped = Keys.map((k)=>{
            return {Key:k}
        })
        const command = new DeleteObjectsCommand({
            Bucket:AWS_BUCKET_NAME,
            Delete:{
                Objects:keyMapped
            }
        })
        return await this.client.send(command)
    }

    async deleteFolder (folderName:string){
        const data = await this.getFiles(folderName) 

        const dataMapped = data.Contents?.map((item)=>{ 
            return item.Key
        }) 
        
        return await this.deleteFiles(dataMapped as string[])
    }

    async getPreSignedUrl ({
        Key,
        expiresIn=60,
        download
    }:{
        Key:string,
        expiresIn?:number,
        download?: "true" | undefined
    }){
        const command = new GetObjectCommand({
            Bucket:AWS_BUCKET_NAME,
            Key,
            ResponseContentDisposition: download ? `attachment; filename="${Key.split("/").pop()}"` : undefined,
        })

        const url = await getSignedUrl(this.client,command,{expiresIn})
        return url
    }

}