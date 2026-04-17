import mongoose from 'mongoose';
import { LOCAL_URI_DB } from '../config/config.service.js';



const connectionDB = async ()=>{
    await mongoose.connect(LOCAL_URI_DB ,{serverSelectionTimeoutMS: 5000})
    .then(()=>{
        console.log(`DB connected successfully ${LOCAL_URI_DB}........😘😘`)
    })
    .catch((err)=>{
        console.error("Error connecting to DB:", err)
    })
}

export default connectionDB;