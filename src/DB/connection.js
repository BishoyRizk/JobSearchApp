import mongoose from "mongoose"




export const connectDB = async()=>{
    await mongoose.connect(process.env.DB).then(res=>{
        console.log('DB connected successfully');
        
    }).catch(err=>{
        console.log('DB connection Failed');
        
    })
}