import * as dbService from '../../../DB/dbService.js'
import { companyModel } from '../../../DB/model/company.model.js'
import { roleTypes, userModel } from '../../../DB/model/User.model.js'
import { asyncHandler } from '../../../utils/err/err.js'
import {successResponse} from '../../../utils/Response/response.js'

// ADMIN


export const ban = asyncHandler(
    async(req,res,next)=>{
        const {userId} = req.body
        console.log(userId);
        
        const {action='ban'} = req.query

        const data = action?.toLowerCase() == 'ban' ? {isBanned:Date.now(),updatedBy:req.user._id} : {$unset:{isBanned:''},updatedBy:req.user._id}


        const user = await dbService.findOne({
            model:userModel,
            filter:{
                _id:userId,
               
                isDeleted:{$exists:false},
                role:roleTypes.user
            }
        })

        if (!user) {
          return next (new Error ('in-valid user',{cause:404}))
        }

        if (action.toLowerCase() == 'ban' && user.isBanned) {
            return next (new Error (' user already banned',{cause:400}))
        }

        if (action.toLowerCase() == 'unban' && !user.isBanned) {
            return next (new Error (' user already unbanned',{cause:400}))
        }

        const updatedUser = await dbService.findOneAndUpdate({
            model: userModel,
            filter: { _id: userId },
            data: { ...data },
            options: { new: true }
        });

       

        return successResponse({res,data:{user}})
    }
)


export const banCompany = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body
        console.log(companyId);
        
        const {action='ban'} = req.query

        const data = action?.toLowerCase() == 'ban' ? {bannedAt:Date.now()} : {$unset:{bannedAt:''}}


        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId,
               
                deletedAt:{$exists:false},
                
            }
        })

        if (!company) {
          return next (new Error ('in-valid company',{cause:404}))
        }

        if (action.toLowerCase() == 'ban' && company.bannedAt) {
            return next (new Error (' company already banned',{cause:400}))
        }

        if (action.toLowerCase() == 'unban' && !company.bannedAt) {
            return next (new Error (' company already unbanned',{cause:400}))
        }

        const updatedCompany = await dbService.findOneAndUpdate({
            model: companyModel,
            filter: { _id: companyId },
            data: { ...data },
            options: { new: true }
        });

       

        return successResponse({res,data:{updatedCompany}})
    }
)


export const approveCompany = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body

        const company = await dbService.findOneAndUpdate({
            model:companyModel,
            filter:{
                _id:companyId,
                approvedByAdmin:false,
                deletedAt:{$exists:false},
                bannedAt:{$exists:false}
            },data:{
                approvedByAdmin:true,

            },options:{
                new:true
            }
        })

        if(!company){
            return next(new Error ('in-valid companyId or already approved'))
        }


        return successResponse({res,data:{company}})
        
    }
)