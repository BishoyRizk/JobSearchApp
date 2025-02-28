import { asyncHandler } from "../../../utils/err/err.js";
import * as dbService from '../../../DB/dbService.js'
import { companyModel } from "../../../DB/model/company.model.js";
import { jobModel } from "../../../DB/model/job.model.js";
import { CVModel, statusTypes } from "../../../DB/model/jobApplication.model.js";
import cloud from '../../../utils/mutler/cloud.js'
import { successResponse } from "../../../utils/Response/response.js";
import { event } from "../../../utils/events/events.js";
import { io } from "../../chat/socket.controllet.js";


export const apply = asyncHandler(
    async(req,res,next)=>{
        const {companyId,jobId} = req.params
        
        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId,
                bannedAt:{$exists:false},
                deletedAt:{$exists:false},
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }


           
        const job = await dbService.findOne({
            model:jobModel,
            filter:{
                _id:jobId,
               closed:false,
               companyId
            }
        })

        if (!job) {
            return next (new Error ('in-valid jobId',{cause:404}))
            
        }

        const jobApp = await dbService.findOne({
            model:CVModel,
            filter:{
                userId:req.user._id,
                jobId,
            }
        })

        if (jobApp) {
            return next (new Error ('you can not apply to the same job more than one time',{cause:400}))
        }

        const {secure_url,public_id} = await cloud.uploader.upload(req.file.path)

        const createJobApply = await dbService.create({
            model:CVModel,
            data:{
                jobId,
                userId:req.user._id,
                userCv:{
                    secure_url,
                    public_id
                }
            }
        })



         successResponse({res,data:{createJobApply}})

        //  عملت دى بالشكل دا عشان الرد يوصل للمستخدم بسرعه والباقى يحصل براحتو مياخدش وقت يعطل المستخدم
         company.HR.forEach(hrId => {
            io.to(hrId.toString()).emit('newApplication', {
                jobId,
                companyId,
                userId: req.user._id,
                userCv: { secure_url, public_id }
            });
        });

        
    }
)


export const acceptOrReject = asyncHandler(
    async(req,res,next)=>{
        const {companyId,jobId} = req.params
        const{jobAppId,status=statusTypes.viewed}=req.body

        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId,
                bannedAt:{$exists:false},
                deletedAt:{$exists:false},
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

        if (!company.HR.includes(req.user._id)) {
            return next (new Error ('only the Company Hr have access to this',{cause:400}))
            
        }


           
        const job = await dbService.findOne({
            model:jobModel,
            filter:{
                _id:jobId,
               closed:false,
               companyId
            }
        })

        if (!job) {
            return next (new Error ('in-valid jobId',{cause:404}))
            
        }

        const jobApp = await dbService.findOne({
            model:CVModel,
            filter:{
                _id:jobAppId
            }
        })

        if (!jobApp) {
            return next (new Error ('in-valid jobAppId',{cause:404}))
        }

        status.toLowerCase()
        const updateStatus = await dbService.findOneAndUpdate({
            model:CVModel,
            filter:{
                _id:jobAppId,
                jobId,
            },data:{
                status
            },options:{
                new:true
            }
        })
        
       
        

        if (status ==statusTypes.accepted || status == statusTypes.rejected) {
            event.emit('cv',{userId:jobApp.userId,status,jobTitle:job.jobTitle,companyName:company.companyName})
        }

        
        


        return successResponse({res,data:{updateStatus}})

    }
)