import multer from 'multer';
import { MulterStorageType ,multer_enum} from '../enum/multer.enum.js';

import { tmpdir } from 'node:os';
import { Request } from 'express';


const multerCloud = ({
    storage_type=MulterStorageType.MEMORY,
    costume_types=multer_enum.image,
    MaxFiles=5*1024*1024
}:
    {
        storage_type?:MulterStorageType,
        costume_types?: string[],
        MaxFiles?: number
    })=>{

    const storage =storage_type === MulterStorageType.MEMORY ? multer.memoryStorage() : multer.diskStorage({
        destination:tmpdir(),
        filename:(req:Request,file:Express.Multer.File,cb:Function)=>{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    })

    const fileFilter = (req:Request,file:Express.Multer.File,cb:Function) => {
        if(!costume_types.includes(file.mimetype)){
            cb(new Error("inValid file type"))
        }
        cb(null,true)
    }


    const upload = multer({storage,fileFilter,limits:{fileSize: MaxFiles}})
    return upload
}

export default multerCloud