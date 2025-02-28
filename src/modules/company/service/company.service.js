import { asyncHandler } from "../../../utils/err/err.js";
import * as dbService from '../../../DB/dbService.js'
import { roleTypes, userModel } from "../../../DB/model/User.model.js";
import { companyModel } from "../../../DB/model/company.model.js";
import {successResponse} from '../../../utils/Response/response.js'
import cloud  from '../../../utils/mutler/cloud.js'
import fs from 'node:fs'
import XLSX from 'xlsx'
import { jobModel } from "../../../DB/model/job.model.js";

export const create = asyncHandler(
    async(req,res,next)=>{
        const {companyName,companyEmail,description,address,industry} = req.body

     
        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                companyEmail,
                companyName
            }

        })


        if (company) {
            return next (new Error('this email is used',{cause:409}))
        }

        await dbService.create({
            model:companyModel,
            data:{
                companyName,companyEmail,description,address,industry,createdBy:req.user._id
            }
        })


        return successResponse({res,status:201})

    }
)


export const updateCompany = asyncHandler(
    async(req,res,next)=>{

        const findCompany =await dbService.findOne({
            model:companyModel,
            filter:{
                createdBy:req.user._id,

            }
        })

        if (!findCompany && req.file || !findCompany && req.body.Hr) {
            return next(new Error ('you can not do this action',{cause:401}) )
        } 

        if (req.file) {
            const {secure_url,public_id} = await cloud.uploader.upload(req.file.path)
            req.body.secure_url = secure_url
            req.body.public_id = public_id
        }

        // i did this to getAndUpdate the company by email and to updateThe other thins not the Email
       
        const user = await dbService.findOne({
            model:userModel,
            filter:{
                _id:req.body.Hr,
                isDeleted:{$exists:false},
                isBanned:{$exists:false}
            }
        })

        if (!user) {
            return next (new Error ('in-valid Hr Id',{cause:404}))
        }

        const company = await dbService.findOneAndUpdate({
            model:companyModel,
            filter:{
                
                companyEmail:req.body.companyEmail,
                bannedAt:{$exists:false},
                deletedAt:{$exists:false},

            },
            data:{
                companyName:req.body.companyName,
                description:req.body.description,
                address:req.body.address,
                industry:req.body.industry,
                numberOfEmployees:req.body.numberOfEmployees,
                $addToSet:{
                    HR:req.body.Hr
                },
                legalAttachment:{
                    secure_url :req.body.secure_url,
                    public_id :req.body.public_id,
                    
                }
            },options:{
                new:true
            }
        })
       

        return successResponse({res,data:{company}})

        
        
    }
)

// i used hooks here to softDelete the related Jobs 

export const deleteCompany = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body
        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                _id:companyId
            }
        })

        
        

        if (!company && req.user.role!=roleTypes.admin) {
            // console.log(req.user.role);
            
            return next(new Error ('you can not do this action'))
        }

        await dbService.updateOne({
            model:companyModel,
            filter:{
                _id:companyId,
                
            },data:{
                deletedAt:Date.now()
            }
        })

        return successResponse({res})
    }
)



export const getCompanyById = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.params

        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                _id:companyId,
                deletedAt:{$exists:false},
                bannedAt:{$exists:false},
            },populate:[
                {path:'jobs'}
            ]
        })

        return successResponse({res,data:{company}})
    }
)

export const getCompany = asyncHandler(
    async(req,res,next)=>{
        const {companyName} = req.params

        const company  = await dbService.findOne({
            model:companyModel,
            filter:{
                companyName,
                bannedAt:{$exists:false},
                deletedAt:{$exists:false}
            }
        })

        if (!company) {
            return next (new Error ('no thing found',{cause:404}))
        }


        return successResponse({res,data:{company}})
    }
)


export const uploadLogo = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body

        const {secure_url,public_id} = await cloud.uploader.upload(req.file.path)

        const company = await dbService.findOneAndUpdate({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                bannedAt:{$exists:false},
                _id:companyId,
                deletedAt:{$exists:false},
            },
            data:{
                Logo:{
                    secure_url,public_id
                }
            },options:{
                new:true
            }
        })
        if (!company) {
            return next (new Error ('something Went Wrong',{cause:400}))
        }
        
        return successResponse({res,data:{company}})
    }
)
export const uploadCover = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body

        const {secure_url,public_id} = await cloud.uploader.upload(req.file.path)

        const company = await dbService.findOneAndUpdate({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                bannedAt:{$exists:false},
                _id:companyId,
                deletedAt:{$exists:false},
            },
            data:{
                coverPic:{
                    secure_url,public_id
                }
            },options:{
                new:true
            }
        })
        if (!company) {
            return next (new Error ('something Went Wrong',{cause:400}))
        }
        
        return successResponse({res,data:{company}})
    }
)


export const deleteLogo = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body

        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                bannedAt:{$exists:false},
                _id:companyId,
                deletedAt:{$exists:false},
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

        if (company  && company.Logo.public_id) {
            await cloud.uploader.destroy(company.Logo.public_id)
        }

        await dbService.updateOne({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                bannedAt:{$exists:false},
                _id:companyId,
                deletedAt:{$exists:false},
            },data:{
                $unset:{
                    Logo:''
                }
            }
        })

        return successResponse({res})
    }
)
export const deleteCover = asyncHandler(
    async(req,res,next)=>{
        const {companyId} = req.body

        const company = await dbService.findOne({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                bannedAt:{$exists:false},
                _id:companyId,
                deletedAt:{$exists:false},
            }
        })

        if (!company) {
            return next (new Error ('in-valid companyId',{cause:404}))
        }

        if (company  && company.coverPic.public_id) {
            await cloud.uploader.destroy(company.coverPic.public_id)
        }

        await dbService.updateOne({
            model:companyModel,
            filter:{
                createdBy:req.user._id,
                bannedAt:{$exists:false},
                _id:companyId,
                deletedAt:{$exists:false},
            },data:{
                $unset:{
                    coverPic:''
                }
            }
        })

        return successResponse({res})
    }
)

















// out of exam ####################################

// export const exportCompanyApplications = asyncHandler(async (req, res, next) => {
//     const { companyId, date } = req.params;

//     const company = await dbService.findOne({
//         model: companyModel,
//         filter: { _id: companyId, deletedAt: { $exists: false }, bannedAt: { $exists: false } }
//     });

//     if (!company) {
//         return next(new Error('Invalid company or not found', { cause: 404 }));
//     }

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const jobs = await dbService.findAll({
//         model: jobModel,
//         filter: { companyId: company._id, closed: false },
//         populate: [{
//             path: 'applications',
//             match: { createdAt: { $gte: startOfDay, $lte: endOfDay } },
//             populate: { path: 'userId', select: 'firstName lastName email phone' }
//         }]
//     });

//     const applications = jobs.flatMap(job =>
//         job.applications.map(app => ({
//             jobTitle: job.jobTitle,
//             userName: `${app.userId.firstName} ${app.userId.lastName}`,
//             email: app.userId.email,
//             phone: app.userId.phone,
//             status: app.status,
//             appliedAt: app.createdAt
//         }))
//     );

//     const worksheet = XLSX.utils.json_to_sheet(applications);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

//     const exportDir = './exports';
//     if (!fs.existsSync(exportDir)) {
//         fs.mkdirSync(exportDir, { recursive: true });
//     }

//     const filePath = `${exportDir}/company_applications_${companyId}_${date}.xlsx`;
//     XLSX.writeFile(workbook, filePath);

//     res.download(filePath, (err) => {
//         if (err) {
//             console.error(err);
//             return next(new Error('Failed to download file', { cause: 500 }));
//         }
//         fs.unlinkSync(filePath);
//     });
// });







// // do not use this it is out of the exam
// export const addHr = asyncHandler(
//     async(req,res,next)=>{
//         const {userId,companyId} = req.body 

//         if (req.user._id == userId) {
//             return next (new Error ('you can not do this action',{cause:400}))
//         }

//         const user = await dbService.findOne({
//             model:userModel,
//             filter:{
//                 _id:userId,
//                 isDeleted:{$exists:false},
//                 isBanned:{$exists:false},
//             }
//         })

//         if (!user) {
//             return next (new Error ('in-valid userId ',{cause:404}))
//         }

//        const company = await dbService.findOneAndUpdate({
//         model:companyModel,
//         filter:{
//             _id:companyId,
//             createdBy:req.user._id,
//             bannedAt:{$exists:false},
//             deletedAt:{$exists:false},
//         },data:{
//             $addToSet:{HR:userId},
//             numberOfEmployees: numberOfEmployees +1
//         },options:{
//             new:true
//         }
//        })

//        if (!company) {
//         return next (new Error ('in-valid companyId ',{cause:404}))
        
//        }


//        return successResponse({res,data:{company}})

//     }
// )




