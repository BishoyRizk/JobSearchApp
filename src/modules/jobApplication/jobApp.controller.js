import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as jobApp from './service/jobApp.service.js'
import { jobAppAuth } from "./jobApp.endPoint.js";
import { apply, status } from "./jobApp.validation.js";
import {fileTypes, uploadCloud} from '../../utils/mutler/multer.js'

const router = Router({mergeParams:true})

// 

router.post('/apply',authentication(),authorization(jobAppAuth.user),uploadCloud(fileTypes.doc).single('file'),validation(apply),jobApp.apply)
router.patch('/status',authentication(),authorization(jobAppAuth.user),validation(status),jobApp.acceptOrReject)

export default router