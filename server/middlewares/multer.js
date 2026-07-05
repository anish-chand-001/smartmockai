import multer from 'multer'

console.log("--> Request hit multer middleware!");
const storage =multer.diskStorage(
    {
        destination:function(req,file,callback){
            callback(null,"public")
        },
        filename:function(req,file,callback){
            const filename = Date.now() +"-" + file.originalname;
            callback(null,filename)
        }
    }
)

export const upload = multer({
    storage,
    limits:{fileSize:5*1024*1024}, // 5mb limit 
})
