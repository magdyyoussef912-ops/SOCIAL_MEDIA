import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import {resolve} from "node:path"
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class notificationService { 
    private readonly client :admin.app.App
    constructor(){
        const serviceAccount = JSON.parse(readFileSync(resolve(__dirname,"../../config/social-media-app-39d65-firebase-adminsdk-fbsvc-df834f63c3.json")) as unknown as string);
        this.client = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        });
    }

    async sendNotification ({
        token,
        data
     }:{
        token :string,
        data:{title:string,body:string}
    }){ 
        const message ={
            token,
            data
        }
        return await this.client.messaging().send(message)
    }

    async sendNotifications ({
        tokens,
        data
     }:{
        tokens :string[],
        data:{title:string,body:string}
    }){ 
        await Promise.all(tokens.map((token)=>{
            this.sendNotification({token,data})
        }))
    }
        
}

export default new notificationService()
    
