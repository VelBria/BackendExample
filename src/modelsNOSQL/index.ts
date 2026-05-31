import mongoose from "mongoose";
import { DB_NOSQL_HOST,DB_NOSQL_NAME,DB_NOSQL_USER,DB_NOSQL_PASS }
 from "../config";

 class MongoConnection{
    private readonly mongoUri:string;
    //mongodb://username:password@host:port/database?authSource=admin
    constructor(){
        this.mongoUri=
        `mongodb://${DB_NOSQL_USER}:${DB_NOSQL_PASS}@${DB_NOSQL_HOST}:27017/${DB_NOSQL_NAME}?authSource=admin`;
        console.log(this.mongoUri);
    }
    public async connect():Promise<void>{
        try{
            await mongoose.connect(this.mongoUri);
            console.log("Conexción exitosa");
        }catch(err){
            console.log(err);
        }
    }
 }
 export const dbnosql =new MongoConnection();