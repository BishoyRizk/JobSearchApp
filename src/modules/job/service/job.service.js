import { asyncHandler } from "../../../utils/err/err.js";
import * as dbService from '../../../DB/dbService.js'
import { companyModel } from "../../../DB/model/company.model.js";
import { jobModel } from "../../../DB/model/job.model.js";
import { successResponse } from "../../../utils/Response/response.js";
import { CVModel } from "../../../DB/model/jobApplication.model.js";




export const createJob = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.params
        
        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

        
        

        if (company.createdBy.toString() != req.user._id.toString() && !company.HR.includes(req.user._id.toString()) ) {
            return next (new Error ('only owner and can HR do this',{cause:404}))
            
        }

        const create = await dbService.create({
            model:jobModel,
            data:{
                ...req.body,
                addedBy:req.user._id,
                companyId
            }
        })
        

        return successResponse({res,data:{create}})
    }
)
export const updateJob = asyncHandler(
    async(req,res,next)=>{
        const {companyId,jobId} = req.params
        
        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

        
        

        if (company.createdBy.toString() != req.user._id.toString() ) {
            return next (new Error ('only owner can do this',{cause:404}))
            
        }

        const update = await dbService.findOneAndUpdate({
            model:jobModel,
            filter:{
                _id:jobId,
                closed:false
            },
            data:{
                ...req.body,
                updatedBy:req.user._id,
                
            },options:{
                new:true
            }
        })
        

        return successResponse({res,data:{update}})
    }
)



export const deleteJob = asyncHandler(
    async(req,res,next)=>{
        const {companyId,jobId} = req.params
        
        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

       
        
        

        if ( !company.HR.includes(req.user._id) ) {
            return next (new Error ('only HR can do this',{cause:404}))
            
        }

        
        

        const deleted = await dbService.findOneAndUpdate({
            model:jobModel,
            filter:{
                companyId,
                _id:jobId,
                closed:false
            },data:{
                closed:true
            },options:{
                new:true
            }
        })

        

        if (!deleted) {
            return next (new Error ('in-valid jobId',{cause:404}))
        }
        

        return successResponse({res,data:{deleted}})
    }
)



export const getAllJobsOrSpecific = asyncHandler(
    async(req,res,next)=>{
        const { companyId} = req.params;
       
        
    let { jobId, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const companyFilter = search
      ? { companyName: { $regex: search, $options: 'i' } ,deletedAt:{$exists:false}, bannedAt:{$exists:false}}
      : { _id: companyId,deletedAt:{$exists:false}, bannedAt:{$exists:false} };

    const company = await dbService.findOne({
      model: companyModel,
      filter: companyFilter
    });

    console.log(company);
    

    if (!company) {
      return next(new Error('Invalid company or not found', { cause: 404 }));
    }

    console.log(jobId ? { companyId: company._id, _id: jobId } : { companyId: company._id });
    
    const jobs = await dbService.findAll({
      model: jobModel,
      filter: jobId ? { companyId: company._id, _id: jobId , closed:false } : { companyId: company._id  ,closed:false },
      skip,
      limit: parseInt(limit),
      sort
    });

    const total = await jobModel.countDocuments({companyId})
    


    return successResponse ({res,data:{jobs,total,page,limit}})
    }
)



export const getFilterJobs = asyncHandler(
    async(req,res,next)=>{
        const { companyId } = req.params
        let { search, page = 1, limit = 10, sort = '-createdAt', workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query
    
        const skip = (parseInt(page) - 1) * parseInt(limit)

    
        const companyFilter = search
          ? { companyName: { $regex: search, $options: 'i' }, deletedAt:{$exists:false}, bannedAt:{$exists:false} }
          : { _id: companyId,deletedAt:{$exists:false}, bannedAt:{$exists:false} }
    
        const company = await dbService.findOne({
          model: companyModel,
          filter: companyFilter
        })
    
        if (!company) {
          return next(new Error('Invalid company or not found', { cause: 404 }))
        }

        const skillsArray = technicalSkills ? technicalSkills.split(',') : []
    
        const jobFilter = {
          companyId: company._id.toString(),
          closed: false,
          
          ...(workingTime && { workingTime }),
          ...(jobLocation && { jobLocation }),
          ...(seniorityLevel && { seniorityLevel }),
          ...(jobTitle && { jobTitle: { $regex: jobTitle, $options: 'i' } }),
          ...(skillsArray.length > 0 && { technicalSkills: { $in: skillsArray } })
        }
    
        const jobs = await dbService.findAll({
          model: jobModel,
          filter: jobFilter,
          skip,
          limit: parseInt(limit),
          sort
        })
    
        const totalCount = await jobModel.countDocuments(jobFilter)

        return successResponse({res,data:{jobs,totalCount,page,limit}})
    }
)


export const getJobApplication = asyncHandler(
    async(req,res,next)=>{
        const {companyId,jobId} = req.params
        
        
        let {  page = 1, limit = 10, sort = '-createdAt' } = req.query
    
        const skip = (parseInt(page) - 1) * parseInt(limit)

        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId,
                deletedAt:{$exists:false}, 
                bannedAt:{$exists:false}
            }
        })
       
        

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

        if (company.createdBy.toString() != req.user._id.toString() && !company.HR.includes(req.user._id)) {
            return next (new Error ('only owner and HR can Do this',{cause:403}))
            
        }


        const findJobApps = await dbService.findAll({
            model:jobModel,
            filter:{
                _id:jobId,
                closed:false,
                companyId
            },populate:[{
                path:'applications',select:'jobId userId',
                populate:[{path:'userId',select:'-_id'}],
                options: {skip,limit,sort}

            }]
        })

        const total = await CVModel.countDocuments({jobId})


        return successResponse({res,data:{findJobApps,page,limit,total}})
    }
)