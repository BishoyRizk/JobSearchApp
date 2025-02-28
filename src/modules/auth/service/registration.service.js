import { asyncHandler } from "../../../utils/err/err.js";
import * as dbService from '../../../DB/dbService.js'
import { providerTypes, roleTypes, userModel } from "../../../DB/model/User.model.js";
import {successResponse} from '../../../utils/Response/response.js'
import { event } from "../../../utils/events/events.js";
import { compareHash, generateHash } from "../../../utils/security/hashing/hash.js";
import { decodedToken,decodedTokenRe, generateToken } from "../../../utils/Token/token.js";
import { tokenTypes } from "../../../middleware/auth.middleware.js";
import { OAuth2Client } from "google-auth-library";


export const signup = asyncHandler(
    async(req,res,next)=>{
        const {userName,password,email,phone,DOB} = req.body

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                email
            }
        })

        if (user && user.isConfirmed) {
            return next (new Error ('email exists',{cause:409}))
        }
        if (user && !user.isConfirmed) {
             event.emit('confirmEmil',{email})
             return successResponse({res,message:'check your gmail',status:202})
            // return next (new Error ('email exists',{cause:409}))
        }

      

        await dbService.create({
            model:userModel,
            data:{
                userName,password,email,phone,DOB
            }
        })
        
        event.emit('confirmEmil',{email})

        return successResponse({res,status:201})

    }
)

export const confirmEmail = asyncHandler(
    async(req,res,next)=>{
       const {code,email}= req.body

       const user = await dbService.findOne({
        model:userModel,
        filter:{
            email
        }
       })

       if (!user) {
        return next (new Error ('user does not exist',{cause:404}))
       }
       if (user.isConfirmed) {
        return next (new Error ('your account is already confirmed',{cause:400}))
       }

       const otpEntry = user.OTP.find(otp=>{
      return  otp.type =='confirmEmail'  && otp.expiresIn > Date.now()
       })

       if (!otpEntry) {
        return next (new Error ('invalid OTP type or expired',{cause:400}))
       }

       if (!compareHash({plainText:code,hashValue:otpEntry.code})) {
        return next (new Error ('invalid OTP ',{cause:400}))
        
       }

       await dbService.updateOne({
        model:userModel,
        filter:{
            email
        },
        data:{
            isConfirmed:true
        }
       })

       return successResponse({res})
 
    }
)



export const forgetPassword = asyncHandler(
    async(req,res,next)=>{
        const {email} = req.body

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                email,
                isDeleted: {$exists:false}

            }
        })

        if (!user) {
            return next (new Error('user does not exist',{cause:404}))
        }
        if (!user.isConfirmed) {
            return next (new Error('your email is not confirmed',{cause:404}))
        }

        event.emit('forgetPassword',{email})

        return successResponse({res})
    }
)
export const resetPassword = asyncHandler(
    async(req,res,next)=>{
        const {code,email,newPassword} = req.body

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                email,
                isDeleted: {$exists:false}

            }
        })

        if (!user) {
            return next (new Error('user does not exist',{cause:404}))
        }
       

        const otpEntry = user.OTP.find(otp=>{
            return otp.type == 'forgetPassword' && otp.expiresIn > Date.now()
        })

        if(!otpEntry){
            return next (new Error ('invalid otp type or expired',{cause:400}))
        }

        if (!compareHash({plainText:code,hashValue:otpEntry.code})) {
            return next (new Error ('invalid otp ',{cause:400}))
            
        }

        const hashPass = generateHash({plainText:newPassword})
        await dbService.updateOne({
            model:userModel,
            filter:{
                email
            },data:{
                password :hashPass
            }
        })

        return successResponse({res})
    }
)



export const login = asyncHandler(
    async(req,res,next)=>{
        const{email,password} = req.body

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                email,
                isDeleted: {$exists:false}
            }
        })

        if (!user) {
            return next (new Error('user does not exist',{cause:404}))
        }
        if (!user.isConfirmed) {
            return next (new Error('confirmFirst',{cause:404}))
        }

        if (!compareHash({plainText:password,hashValue:user.password})) {
            return next (new Error('user does not exist ',{cause:404}))
        }

        const accessToken = generateToken({payLoad:{id:user._id},signature: user.role == roleTypes.user ? process.env.USER_ACCESS_TOKEN : process.env.SYSTEM_ACCESS_TOKEN,expiresIn:'1h'})
        const refreshToken = generateToken({payLoad:{id:user._id},signature: user.role == roleTypes.user ? process.env.USER_REFRESH_TOKEN : process.env.SYSTEM_REFRESH_TOKEN,expiresIn:'7d'})

        return successResponse ({res,data:{Token:{
            accessToken,
            refreshToken
        }}})
    }
)


export const refreshToken = asyncHandler(
    async(req,res,next)=>{
        const user = await decodedToken({authorization:req.headers.authorization,tokenType:tokenTypes.refresh,next})
        console.log(user);
        

        const accessToken = generateToken({payLoad:{id:user._id},signature:user.role == roleTypes.user ? 
            process.env.USER_ACCESS_TOKEN 
            : process.env.SYSTEM_ACCESS_TOKEN,expiresIn:'1h'})


        const refreshToken = generateToken({payLoad:{id:user._id},signature:user.role == roleTypes.user ? 
            process.env.USER_REFRESH_TOKEN 
            : process.env.SYSTEM_REFRESH_TOKEN,expiresIn:'7d'})

        return successResponse ({res,data:{Token:{
            accessToken,
            refreshToken
        }}})
    }
)



export const signupGoogle = asyncHandler(
    async(req,res,next)=>{
        const {idToken} = req.body
        
        
        const client = new OAuth2Client()
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience:process.env.CLIENT_ID
            })

            const payLoad = ticket.getPayload()
            return payLoad
        }

        const payload = await verify()

        if (!payload.email_verified) {
            return next (new Error ('in-valid account',{cause:404}))
        }

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                email:payload.email
            }
        })

       
        

        if (user) {
            return next (new Error ('user exists',{cause:409}))
            
        }

       

        

        const newUser = new userModel({
            userName:payload.name,
                   email:payload.email,
               provider : providerTypes.google,
                   isConfirmed:true,
                 
        })

       await newUser.save()

        return successResponse ({res,status:201})
    }
)


export const loginGoogle = asyncHandler(
    async(req,res,next)=>{
        const {idToken} = req.body
        const client = new OAuth2Client()
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience:process.env.CLIENT_ID
            })

            const payLoad = ticket.getPayload()
            return payLoad
        }

        const payload = await verify()

        if (!payload.email_verified) {
            return next (new Error ('in-valid account',{cause:404}))
        }

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                email:payload.email
            }
        })

       
        

        if (!user) {
            return next (new Error ('user does not exist',{cause:400}))
            
        }

       

        const accessToken= generateToken({payLoad:{id:user._id},expiresIn:'1h'})
        const refreshToken =generateToken({payLoad:{id:user._id},expiresIn:'7d'})

       

        return successResponse ({res,status:200,data:{
            token:{
                accessToken,
                refreshToken
            }
        }})
    }
)


