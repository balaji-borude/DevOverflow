// mongoDB Connection file 

import mongoose, { Mongoose } from "mongoose";
import Logger from "./logger";
 
const MONGO_URL = process.env.MONGO_URL;

if(!MONGO_URL){
    throw new Error("MONGO_URL is not defined");
};

// cached the connection 
// 1. server action dont really remember its previosus server action so we have to cached the connection --> which help to connect on every server action call 

interface MongooseCache{
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
};

declare global{
    var mongoose:MongooseCache;
};

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn:null, promise:null}; 
};

const dbConnect = async():Promise<Mongoose>=>{
    // if there is alredy connection happen then return 
    if(cached.conn){
        Logger.info("MongoDB Connection already cached");
        return cached.conn;
    };

    // if connection is not cached then connect to Db 
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGO_URL,{
            dbName:"DevOverflow_DB" //we can give db name is url also 
        })
        .then((result)=>{
            // console.log("Db Connected Succesfully");
            Logger.info("Db Connected Succesfully");
            return result;
        })
        .catch((error)=>{
            console.log("Issue in Db Connection ");
            throw error
        })
    }
    cached.conn = await cached.promise;
    return cached.promise;
};

export default dbConnect;