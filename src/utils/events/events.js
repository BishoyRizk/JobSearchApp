import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { verfiEmailTemplate } from "./temp.js";
import { sendEmail } from "../nodemaile.js";
import * as dbService from '../../DB/dbService.js'
import { userModel } from "../../DB/model/User.model.js";
import { generateHash } from "../security/hashing/hash.js";
import { statusTypes } from "../../DB/model/jobApplication.model.js";
export const event = new EventEmitter()


event.on('confirmEmil',async(data)=>{
    const otp = customAlphabet('0123456789',7)()
    const hashOTP = generateHash({plainText:otp})
    const {email} = data
    let html = verfiEmailTemplate({code:otp})
    await dbService.updateOne({
        model:userModel,
        filter:{
            email
        },
        data:{
            $push:{
                OTP:{code:hashOTP,
                    type:'confirmEmail',
                    expiresIn : new Date(Date.now()+10*60*1000) 
                }
                
            }
        }
    })
    await sendEmail({to:email,html})
})


event.on('forgetPassword',async(data)=>{
    const otp = customAlphabet('0123456789',7)()
    const hashOTP = generateHash({plainText:otp})
    const {email} = data
    let html = verfiEmailTemplate({code:otp,message:'forgetPassword'})
    await dbService.updateOne({
        model:userModel,
        filter:{
            email
        },
        data:{
            $push:{
                OTP:{code:hashOTP,
                    type:'forgetPassword',
                    expiresIn : new Date(Date.now()+10*60*1000) 
                }
                
            }
        }
    })
    await sendEmail({to:email,html,subject:'forgetPassword'})
})
event.on('cv',async(data)=>{
   
    const {userId,status,jobTitle,companyName} = data
    let html = verfiEmailTemplate({code: status == statusTypes.accepted ? `congrats you have been accepted at position ${jobTitle} at ${companyName}` 
        :`we are sorry ${jobTitle}  ${companyName} ` ,message:status})

    const user = await dbService.findOne({
        model:userModel,
        filter:{
            _id:userId
        }
    })
  
    await sendEmail({to:user.email,html,subject:'cvStatus'})
})

