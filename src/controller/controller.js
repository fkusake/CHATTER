//INTERNAL DEPENDENCIES :
import { onlineUsers } from "../../server.js";
import aiConfig from "../../AIConfig.js";

export default class ChatController {
    //LOGIN PAGE CONTROLLER:
    static loginPage(req, res) {
        return res.status(200).render("Login");
    }

    //FILE- HANDLE CONTROLLER:
    static fileHandle(req, res) {
        return res.status(201).redirect(`/main?userName=${req.body.user}&userImage=${req.file.filename}`);
    }

    //MAIN PAGE CONTROLLER:
    static mainPage(req, res) {
        return res.status(200).render("main", { userName: req.query.userName, userImage: req.query.userImage, users: Array.from(onlineUsers) });
    }

    //AI CONTROLLER :
    static async aiDataHandle(req, res) {
        try {
            const aiModel = aiConfig();
            const output = await aiModel.invoke(`Answer the following question in 3 to 5 lines. Question: "${req.body.Question}"`);
            return res.status(200).json({ output: output.content });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Server error! will be Fixed soon...");
        }
    }
}