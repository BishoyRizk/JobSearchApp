import { Router } from "express";
import * as user from './service/user.services.js'
import { fileTypes, uploadCloud } from "../../utils/mutler/multer.js";
const router = Router()
import {authentication,authorization} from '../../middleware/auth.middleware.js'
import { userAuthorization } from "./user.endPonit.js";
import { validation } from "../../middleware/validation.middleware.js";
import {  coverImg, getAnotherUser, profileImg, updatePassword, updateProfile } from "./user.validation.js";


router.patch('/profile/update',authentication(),authorization(userAuthorization.user),validation(updateProfile),user.updateProfile)
router.get('/profile',authentication(),authorization(userAuthorization.user),user.getProfile)

router.get('/profile/:userId',authentication(),authorization(userAuthorization.user),validation(getAnotherUser),user.getAnotherUser)
router.patch('/profile/updatePassword',authentication(),authorization(userAuthorization.user),validation(updatePassword),user.updatePassword)

router.patch('/profile/profileImg',authentication(),authorization(userAuthorization.user),uploadCloud(fileTypes.image).single('image'),
validation(profileImg),user.profileImg)
router.patch('/profile/coverImg',authentication(),authorization(userAuthorization.user),uploadCloud(fileTypes.image).single('image'),
validation(coverImg),user.coverImg)

router.delete('/profile/DeleteProfileImg',authentication(),authorization(userAuthorization.user),user.deleteProfileImg)
router.delete('/profile/DeleteCoverImg',authentication(),authorization(userAuthorization.user),user.deleteCoverImg)

router.delete('/profile/softDelete',authentication(),authorization(userAuthorization.user),user.SoftDeleteUser)

// ####### ADMIN 



export default router