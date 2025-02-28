import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const createJob = Joi.object().keys({
    companyId:generalFields.id.required(),
    jobTitle:generalFields.job.required(),
    workingTime:generalFields.job.required(),
    seniorityLevel:generalFields.job.required(),
    jobLocation:generalFields.job.required(),
    jobDescription:generalFields.jobDesc.required(),
    technicalSkills:generalFields.jobArray.required(),
    softSkills:generalFields.jobArray.required()
}).required()
export const updateJob = Joi.object().keys({
    jobId:generalFields.id.required(),
    companyId:generalFields.id.required(),
    jobTitle:generalFields.job.required(),
    workingTime:generalFields.job.required(),
    seniorityLevel:generalFields.job.required(),
    jobLocation:generalFields.job.required(),
    jobDescription:generalFields.jobDesc.required(),
    technicalSkills:generalFields.jobArray.required(),
    softSkills:generalFields.jobArray.required()
}).required()


export const deleteJob = Joi.object().keys({
    jobId:generalFields.id.required(),
    companyId:generalFields.id.required(),


}).required()


export const getJobs = Joi.object().keys({
    companyId:generalFields.id.required(),
    jobId:generalFields.id,
    page:Joi.number().min(1).positive(),
    limit:Joi.number().positive(),
    search:generalFields.company


}).required()
export const getFilterJobs = Joi.object().keys({
    companyId:generalFields.id.required(),
    jobId:generalFields.id,
    page:Joi.number().min(1).positive(),
    limit:Joi.number().positive(),
    jobTitle:generalFields.job,
    workingTime:generalFields.job,
    seniorityLevel:generalFields.job,
    jobLocation:generalFields.job,
    jobDescription:generalFields.jobDesc,
    technicalSkills:generalFields.job,
    
    


}).required()
export const getApps = Joi.object().keys({
    companyId:generalFields.id.required(),
    jobId:generalFields.id,
    page:Joi.number().min(1).positive(),
    limit:Joi.number().positive(),
 
    
    


}).required()