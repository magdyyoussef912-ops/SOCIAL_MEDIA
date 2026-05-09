import mongoose from 'mongoose';
import { DB_URI_ONLINE, LOCAL_URI_DB } from '../config/config.service.js';



const connectionDB = async ()=>{
    await mongoose.connect(DB_URI_ONLINE ,{serverSelectionTimeoutMS: 5000})
    .then(()=>{
        console.log(`DB connected successfully ${DB_URI_ONLINE}........😘😘`)
    })
    .catch((err)=>{
        console.error("Error connecting to DB:", err)
    })
}

export default connectionDB;