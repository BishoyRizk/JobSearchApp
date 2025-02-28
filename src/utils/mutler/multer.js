import multer from "multer"

export const fileTypes = {
    image:['image/jpeg','image/png'],
    doc:['application/pdf'],
}


export const uploadCloud = (files=[])=>{
    const storage = multer.diskStorage({})


    function fileFilter(req,file,cb){
        if (files.includes(file.mimetype)) {
            cb(null,true)
        }else{
            cb('in-validDoc',false)
        }
    }

    return multer({dest:'default',fileFilter,storage})
}