import { asyncHandler } from "../utils/err/err.js"
import {decodedToken, verifyToken} from '../utils/Token/token.js'
import * as dbService from '../DB/dbService.js'
import { userModel } from "../DB/model/User.model.js"
export const tokenTypes = {
    access:'access',
    refresh:'refresh'
}


export const authentication = ()=>{
 return asyncHandler(
   async(req,res,next)=>{
       
        req.user = await decodedToken({authorization:req.headers.authorization,tokenType:tokenTypes.access,next})
        return next()
    
    }
    
 )
}


export const authenticationGraphQl = async({authorization,tokenType=tokenTypes.access}={})=>{

       
        const [bearer,token] = authorization?.split(' ') || []
       
           if (!bearer || !token) {
            //   return next (new Error ('authorization is required',{cause:400})) 
              throw new Error ('authorization is required')
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
            //    return next(new Error ('invalid token Payload',{cause:400}))
               throw new Error('invalid token Payload')
           }
       
           const user = await dbService.findOne({
               model:userModel,
               filter:{
                   _id:decoded.id,
                   isDeleted:{$exists:false}
                  
       
               }
           })
           
           
       
           if (!user) {
            //    return next (new Error ('invalid user',{cause:401}))
               throw new Error ('invalid user')
           }
       
           if (user.changeCredentialTime?.getTime()>= decoded.iat * 1000) {
            //    return next (new Error ('in-valid Credentials',{cause:400}))
               throw new Error ('in-valid Credentials')
               
           }
       
           return user
    
    }





export const authenticationSocket = async({socket={},tokenType=tokenTypes.access}={})=>{

       
        const [bearer,token] = socket.handshake?.auth?.authorization?.split(' ') || []
       
           if (!bearer || !token) {
            return {data:{message:'authorization is required',status:400}}
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
            
               return {data:{message:'invalid token Payload',status:400}}
           }
       
           const user = await dbService.findOne({
               model:userModel,
               filter:{
                   _id:decoded.id,
                   isDeleted:{$exists:false}
                  
       
               }
           })
           
           
       
           if (!user) {
            
               return {data:{message:'invalid user',status:401}}
           }
       
           if (user.changeCredentialTime?.getTime()>= decoded.iat * 1000) {
            
               return {data:{message:'in-valid Credentials',status:401}}

               
           }
       
           return {data:{user,valid:true}}
    
    }
    
 










    


export const authorization = (accessRoles=[])=>{
    return asyncHandler(
        async(req,res,next)=>{

            if (!accessRoles.includes(req.user.role)) {
                return next (new Error ('not authorized account',{cause:403}))
            }
    
    
            return next()
    
        }
    )
}

export const authorizationGraphQl = ({accessRoles=[],role}={})=>{
  
            if (!accessRoles.includes(role)) {
                // return next (new Error ('not authorized account',{cause:403}))
                throw new Error ('not authorized account')
            }
    
    
            return true
    
   
}




