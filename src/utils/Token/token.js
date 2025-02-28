import jwt from 'jsonwebtoken'
import { tokenTypes } from '../../middleware/auth.middleware.js'
import * as dbService from '../../DB/dbService.js'
import {userModel} from '../../DB/model/User.model.js'

export const generateToken = ({payLoad={},signature=process.env.USER_ACCESS_TOKEN,expiresIn='1h'}={})=>{
    const token = jwt.sign(payLoad,signature,{expiresIn})
    return token
}
export const verifyToken = ({token='',signature=process.env.USER_ACCESS_TOKEN}={})=>{
    
   
    
   
    
    
    const decoded = jwt.verify(token,signature)
    
    
    return decoded
}



export const decodedToken = async({authorization='',tokenType=tokenTypes.access,next}={})=>{
    const [bearer,token] = authorization?.split(' ') || []

    if (!bearer || !token) {
       return next (new Error ('authorization is required',{cause:400})) 
    }

    let accessSignature= ''
    let refreshSignature= ''

    switch (bearer) {
        case 'bearer':
            accessSignature = process.env.USER_ACCESS_TOKEN
            refreshSignature = process.env.USER_REFRESH_TOKEN
            
            
            break;
        case 'system':
            accessSignature = process.env.SYSTEM_ACCESS_TOKEN
            refreshSignature = process.env.SYSTEM_REFRESH_TOKEN
            
            break;
    
        default:
            break;


    }

   
   
    

  
   
     

    // console.log(process.env.USER_ACCESS_TOKEN);
    // console.log(process.env.USER_REFRESH_TOKEN);
    // console.log(process.env.SYSTEM_ACCESS_TOKEN);
    // console.log(process.env.SYSTEM_REFRESH_TOKEN);
    

    const decoded = verifyToken({token,signature: tokenType == tokenTypes.access ? accessSignature : refreshSignature })
   
    
    if(!decoded || !decoded.id){
        return next(new Error ('invalid token Payload',{cause:400}))
    }

    const user = await dbService.findOne({
        model:userModel,
        filter:{
            _id:decoded.id,
            isDeleted:{$exists:false}
           

        }
    })
    
    

    if (!user) {
        return next (new Error ('invalid user',{cause:401}))
    }

    if (user.changeCredentialTime?.getTime()>= decoded.iat * 1000) {
        return next (new Error ('in-valid Credentials',{cause:400}))
        
    }

    return user
}


// ###########
// ignore this
export const decodedTokenRe = async({authorization='',tokenType=tokenTypes.refresh,next}={})=>{
    const [bearer,token] = authorization?.split(' ') || []
    console.log(bearer,token);
    

    if (!bearer || !token) {
       return next (new Error ('authorization is required',{cause:400})) 
    }

    let accessSignature= ''
    let refreshSignature= ''

    switch (bearer) {
        case 'bearer':
            accessSignature = process.env.USER_ACCESS_TOKEN
            refreshSignature = process.env.USER_REFRESH_TOKEN
            
            
            break;
        case 'system':
            accessSignature = process.env.SYSTEM_ACCESS_TOKEN
            refreshSignature = process.env.SYSTEM_REFRESH_TOKEN
            
            break;
    
        default:
            break;


    }

//    console.log(accessSignature,refreshSignature);
   
    

  
  
   
     

    // console.log(process.env.USER_ACCESS_TOKEN);
    // console.log(process.env.USER_REFRESH_TOKEN);
    // console.log(process.env.SYSTEM_ACCESS_TOKEN);
    // console.log(process.env.SYSTEM_REFRESH_TOKEN);
    

    const decoded = verifyToken({token,signature: tokenType == tokenTypes.access ? accessSignature : refreshSignature })
   
    
    if(!decoded || !decoded.id){
        return next(new Error ('invalid token Payload',{cause:400}))
    }

    const user = await dbService.findOne({
        model:userModel,
        filter:{
            _id:decoded.id,
            isDeleted:{$exists:false}
           

        }
    })
    
    

    if (!user) {
        return next (new Error ('invalid user',{cause:401}))
    }

    if (user.changeCredentialTime?.getTime()>= decoded.iat * 1000) {
        return next (new Error ('in-valid Credentials',{cause:400}))
        
    }

    return user
}