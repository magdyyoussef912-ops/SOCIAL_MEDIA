import { HydratedDocument, MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
import { Model } from "mongoose";






abstract class baseRepository<Tdocument> {


    constructor(protected readonly model:Model<Tdocument>){}


    async create(data:Partial<Tdocument>) : Promise< HydratedDocument<Tdocument>>{
        return this.model.create(data)
    }

    async findById (id:Types.ObjectId):Promise< HydratedDocument<Tdocument>| null>{
        return this.model.findById(id)
    }

    async findOne ({filter,projection}:{filter: QueryFilter<Tdocument>,projection?: ProjectionType<Tdocument>}):Promise< HydratedDocument<Tdocument>| null>{
        return this.model.findOne(filter,projection)
    }

    async find ({
        filter,
        projection,
        options
    }:
        {
            filter: QueryFilter<Tdocument>,
            projection?: ProjectionType<Tdocument>,
            options?: QueryOptions<Tdocument>
        }):
        Promise< HydratedDocument<Tdocument>[] | []>{
        return this.model.find(filter,projection)
        .sort(options?.sort)
        .skip(options?.skip!)
        .limit(options?.limit!)
        .populate(options?.populate as PopulateOptions)
    }


    async findByIdAndUpdate ({
        id,
        update,
        options
    }:
        {
            id?: Types.ObjectId,
            update: UpdateQuery<Tdocument>,
            options?: QueryOptions<Tdocument>
        }):
        Promise< HydratedDocument<Tdocument> | null>{
        return this.model.findByIdAndUpdate(id,update,{new:true,...options})
    }

    async findOneAndUpdate ({
        filter,
        update,
        options
    }:
        {
            filter: QueryFilter<Tdocument>,
            update: UpdateQuery<Tdocument>,
            options?: QueryOptions<Tdocument>
        }):
        Promise< HydratedDocument<Tdocument> | null>{
        return this.model.findOneAndUpdate(filter,update,{new:true,...options})
    }

    async findOneAndDelete ({
        filter,
        options={}
    }:
        {
            filter: QueryFilter<Tdocument>,
            options?: QueryOptions<Tdocument>
        }):
        Promise< HydratedDocument<Tdocument> | null>{
        return this.model.findOneAndDelete(filter,options)
    }


    async deleteOne ({filter}: {filter: QueryFilter<Tdocument>}):Promise<any>{
        return this.model.deleteOne(filter)
    }

    
    async deleteMany ({filter}: {filter: QueryFilter<Tdocument>}):Promise<any>{
        return this.model.deleteMany(filter)
    }
    
    async updateOne ({filter,update,options={}}: {filter: QueryFilter<Tdocument>,update: UpdateQuery<Tdocument>,options?:  MongooseUpdateQueryOptions<Tdocument> & any}):Promise<any>{
        return this.model.updateOne(filter,update,options)
    } 
    
    async updateMany ({filter,update,options={}}: {filter: QueryFilter<Tdocument>,update: UpdateQuery<Tdocument>,options?: MongooseUpdateQueryOptions<Tdocument> & any}):Promise<any>{
        return this.model.updateMany(filter,update,options)
    }


    async pagenate<T> ({
        page,
        limit,
        sort,
        populate,
        search
    }:{
        page?:number,
        limit?:number,
        sort?:any,
        populate?:any,
        search?:QueryFilter <T>
    }){
        page = +page!
        limit = +limit!

        if (page <1) page = 1
        if (limit <1) limit = 1
        
        const skip = (page - 1 ) * limit

        const [data,totalDoc] = await Promise.all([
            await this.model.find({...search ?? {}}).limit(limit).skip(skip).sort(sort).populate(populate).exec(),
            await this.model.countDocuments({...search ?? {}})
        ])

        const totalPages = Math.ceil(totalDoc / limit)
        return {
            Meta:{
                currentPage:page,
                limit,
                totalPages,
                totalDoc
            },
            data
        }

    } 


}

export default baseRepository