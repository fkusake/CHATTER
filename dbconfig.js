import mongoose from "mongoose";

const db = async()=>{
    try{
        await mongoose.connect(`${process.env.DB_URL}`);
        console.log("Connected to Database");
    }catch(error){
        console.log(error);
    }
}

export default db;