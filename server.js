//External Dependencies :
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import layouts from "express-ejs-layouts"
import path from "path";



//Internal Dependencies :
import { imageUpload } from "./multer/multer.js";
import ChatController from "./src/controller/controller.js";
import DBModel from "./src/Model/chatsSchema.js";
import db from "./dbconfig.js";


const app = express();
const server = http.createServer(app);


//Application level :
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(layouts);
app.use(express.static("src/views"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));


// SET for tracking Online Users :
export let onlineUsers = new Set();

//Routes :
app.get("/", ChatController.loginPage);

app.post("/upload", imageUpload.single("imageUrl"),ChatController.fileHandle);

app.get("/main", ChatController.mainPage);

app.post("/AI",imageUpload.none(),ChatController.aiDataHandle);





//IO - OBJECT :
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//SOCKET CONFIG :
io.on("connection", async(socket) => {

    console.log("Connection created");

    //SOCKETS ON JOIN :
    socket.on("join", async (user) => {
        try {
            let now = new Date();
            let yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const data = await DBModel.find({ createdAt: { $gte: yesterday }});
            if(data.length > 0){
                socket.emit("pastMessages",data);
            }
            socket.userName = user;
            onlineUsers.add(user);
            socket.broadcast.emit("onlineUsers", user);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server error! will be Fixed soon...");
        }
    })

    //SOCKETS ON NEW MESSAGE :
    socket.on("newMessage", async (data) => {
        try {
            const chat = new DBModel({ name: data.user, image: data.image, message: data.message, time: data.time })
            await chat.save();
            socket.broadcast.emit("broadcast", data);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server error! will be Fixed soon...");
        }
    });

    // SOCKETS ON TYPING :
    socket.on("typing",(user)=>{
        socket.broadcast.emit("focusing",user);
    })

    //SOCKET ON STOP FOCUSING :
     socket.on("stoped",()=>{
        socket.broadcast.emit("exited");
    })

    //SOCKET ON DISCONNECT :
    socket.on("disconnect", async () => {
        onlineUsers.delete(socket.userName);
        socket.broadcast.emit("userOffline", socket.userName);
        console.log("Connection Disconnected");
    })
})


server.listen(process.env.PORT, () => {
    db();
    console.log("Server is running at port 3000");
})