import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import * as company from './service/company.service.js'
import { companyAuth } from "./company.endPonit.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addHr, createCompany, deleteCompany, deleteCover, deleteLogo, getCompany, getCompanyById, updateCompany, updateCover, updateLogo } from "./company.validation.js";
import { fileTypes, uploadCloud } from "../../utils/mutler/multer.js";
import jobController from '../job/job.controller.js'

const router = Router()

router.use('/:companyId/job',jobController)

router.post('/create',authentication(),authorization(companyAuth.company),validation(createCompany),company.create)
router.patch('/update',authentication(),authorization(companyAuth.company),uploadCloud([...fileTypes.doc,...fileTypes.image]).single('file'),validation(updateCompany),company.updateCompany)
// i did not user authorization here because user and admin can use all
router.delete('/delete',authentication(),validation(deleteCompany),company.deleteCompany)
router.get('/:companyName',authentication(),validation(getCompany),company.getCompany)
router.get('/getCompany/:companyId',authentication(),validation(getCompanyById),company.getCompanyById)
// #####

router.patch('/updateLogo',authentication(),authorization(companyAuth.company),uploadCloud(fileTypes.image).single('file'),validation(updateLogo),company.uploadLogo)
router.patch('/updateCover',authentication(),authorization(companyAuth.company),uploadCloud(fileTypes.image).single('file'),validation(updateCover),company.uploadCover)
router.delete('/deleteLogo',authentication(),authorization(companyAuth.company),validation(deleteLogo),company.deleteLogo)
router.delete('/deleteCover',authentication(),authorization(companyAuth.company),validation(deleteCover),company.deleteCover)

// ##################
// out of exam

// router.get('/sheet/:companyId/:date',authentication(),company.exportCompanyApplications)

// router.patch('/addHr',authentication(),authorization(companyAuth.company),validation(addHr),company.addHr)




export default router