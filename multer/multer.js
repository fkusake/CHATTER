import multer from "multer";



const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public")
    },
    filename:(req,file,cb)=>{
        const fileName = Date.now()+"-"+file.originalname;
        cb(null,fileName);
    }
})


export let imageUpload = multer({storage:storage});