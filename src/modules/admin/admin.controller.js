import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as admin from './service/admin.service.js'
import { approved, banCompany, banUser } from "./admin.validation.js";
import { adminAuthorization } from "./admin.endPonit.js";

const router = Router()


router.patch('/dashBoard/ban',authentication(),authorization(adminAuthorization.admin),validation(banUser),admin.ban)
router.patch('/dashBoard/ban/company',authentication(),authorization(adminAuthorization.admin),validation(banCompany),admin.banCompany)
router.patch('/dashBoard/ban/companyApproval',authentication(),authorization(adminAuthorization.admin),validation(approved),admin.approveCompany)

export default router