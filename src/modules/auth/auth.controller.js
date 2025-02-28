
import { Router } from 'express'
// import { signup } from './service/registration.service.js';
import * as registrationService from './service/registration.service.js';
import {validation} from '../../middleware/validation.middleware.js'
import { confirm, forgetPassword, login, resetPassword, signup } from './auth.validation.js';
import { authentication, authorization } from '../../middleware/auth.middleware.js';
import { authEndPoint } from './endpoint.js';

const router = Router();


router.post("/signup",validation(signup), registrationService.signup)
router.post("/login",validation(login), registrationService.login)
router.post("/signupGoogle", registrationService.signupGoogle)
router.post("/loginGoogle", registrationService.loginGoogle)
router.patch("/confirmEmail",validation(confirm), registrationService.confirmEmail)
router.patch("/forgetPassword",validation(forgetPassword), registrationService.forgetPassword)
router.patch("/resetPassword",validation(resetPassword), registrationService.resetPassword)
router.get("/refreshToken", registrationService.refreshToken)

export default router