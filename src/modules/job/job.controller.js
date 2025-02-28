import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { jobAuth } from "./job.endPoint.js";
import { createJob, deleteJob, getApps, getFilterJobs, getJobs, updateJob } from "./job.validation.js";
import * as job from './service/job.service.js'
import JobAppController from '../jobApplication/jobApp.controller.js'
const router = Router({mergeParams:true})

router.use('/:jobId/jobApp',JobAppController)


router.post('/create',authentication(),authorization(jobAuth.user),validation(createJob),job.createJob)
router.patch('/update/:jobId',authentication(),authorization(jobAuth.user),validation(updateJob),job.updateJob)
router.delete('/delete/:jobId',authentication(),authorization(jobAuth.user),validation(deleteJob),job.deleteJob)
router.get('/getJobs',authentication(),authorization(jobAuth.user),validation(getJobs),job.getAllJobsOrSpecific)
router.get('/getFilterJobs',authentication(),authorization(jobAuth.user),validation(getFilterJobs),job.getFilterJobs)
router.get('/getJobApplication/:jobId',authentication(),authorization(jobAuth.user),validation(getApps),job.getJobApplication)


export default router