import mongoose from "mongoose";


const chatsData = mongoose.Schema({
    name:String,
    image:{
        type:String
    },
    message:{
        type:String
    },
    time:{
        type:String
    }
},{ timestamps: true })

const DBModel = mongoose.model("chats",chatsData);

export default DBModel;