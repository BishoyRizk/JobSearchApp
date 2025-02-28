import { asyncHandler } from "../../../utils/err/err.js";
import {successResponse} from '../../../utils/Response/response.js'
import cloud from '../../../utils/mutler/cloud.js'
import { generateEncryption } from "../../../utils/security/encryption/enc.js";
import * as dbService from '../../../DB/dbService.js'
import { userModel } from "../../../DB/model/User.model.js";
import { compareHash, generateHash } from "../../../utils/security/hashing/hash.js";


export const updateProfile = asyncHandler(
    async(req,res,next)=>{
        if (req.body.phone) {
            req.body.phone = generateEncryption({plainText:req.body.phone})
            // console.log(phone);
            
        }

     const user =   await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id
            },data:{
                ...req.body,
                
            },options:{
                new:true
            }
        })


        return successResponse({res,data:{user}})
    }
)


export const getProfile = asyncHandler(
    async(req,res,next)=>{
        const user = await dbService.findOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
            },
            select: ' firstName lastName userName phone profilePic coverPic gender'
        })

        const { firstName, lastName, ...userData } = user.toObject()
        return successResponse({res,data:{userData}})
    }
)

export const getAnotherUser = asyncHandler(
    async(req,res,next)=>{
        const {userId} = req.params

        const user = await dbService.findOne({
            model:userModel,
            filter:{
                _id:userId,
                isDeleted:{$exists:false}
            },
            select:' firstName lastName userName phone profilePic coverPic '
        })

        if (!user) {
            return next(new Error ('in-valid userId',{cause:404}))
        }

    
        const { firstName, lastName, ...userData } = user.toObject()

        return successResponse({res,data:{userData}})
    }
)



export const updatePassword = asyncHandler(
    async(req,res,next)=>{
        const {oldPass,password,confirmPass} = req.body

        if (!compareHash({plainText:oldPass,hashValue:req.user.password})) {
           return next (new Error('oldPassword is not right',{cause:400}))
            
        }


        const hash = generateHash({plainText:password})
        const user = await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
            },data:{
                password:hash,
                changeCredentialTime:Date.now()
            }
        })




        return successResponse({res})

        


    }
)

export const profileImg = asyncHandler(
    async(req,res,next)=>{
        
        
        const {secure_url,public_id} = await cloud.uploader.upload(req.file.path)

        const user = await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
            },
            data:{
                profilePic:{
                    secure_url,
                    public_id
                }
            }
        })
        
        
        
        return successResponse({res})
    }
)
export const coverImg = asyncHandler(
    async(req,res,next)=>{
        
        
        const {secure_url,public_id} = await cloud.uploader.upload(req.file.path)

        const user = await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
            },
            data:{
                coverPic:{
                    secure_url,
                    public_id
                }
            }
        })
        
        
        
        return successResponse({res})
    }
)


export const deleteProfileImg = asyncHandler(
    async(req,res,next)=>{
        const getUser = await dbService.findById({
            model:userModel,
            _id:req.user._id
        }) 

        if (getUser.profilePic.public_id) {
            await cloud.uploader.destroy(getUser.profilePic.public_id)
        }

        await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
            },
            data:{
                $unset:{profilePic:null}
            }
        })


        return successResponse({res})
    }
)
export const deleteCoverImg = asyncHandler(
    async(req,res,next)=>{
        const getUser = await dbService.findById({
            model:userModel,
            _id:req.user._id
        }) 

        if (getUser.coverPic.public_id) {
            await cloud.uploader.destroy(getUser.coverPic.public_id)
        }

        await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
            },
            data:{
                $unset:{coverPic:null}
            }
        })


        return successResponse({res})
    }
)

export const SoftDeleteUser = asyncHandler(
    async(req,res,next)=>{

        await dbService.updateOne({
            model:userModel,
            filter:{
                _id:req.user._id,
                isDeleted:{$exists:false}
                
            },data:{
                isDeleted:Date.now(),
                changeCredentialTime:Date.now()
            }
        })


        return successResponse({res})
    }
) 





