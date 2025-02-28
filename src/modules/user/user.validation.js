import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateProfile = Joi.object().keys({
    phone:generalFields.phone,
    DOB:generalFields.DOB,
    firstName:generalFields.userName,
    lastName:generalFields.userName,
    gender:generalFields.gender
}).required()


export const getAnotherUser = Joi.object().keys({
    userId:generalFields.id.required()
}).required()


export const updatePassword = Joi.object().keys({
    oldPass:generalFields.password.required(),
    password:generalFields.password.required(),
    confirmPass:generalFields.confirmPassword.required()
}).required()


export const profileImg = Joi.object().keys({
    file:generalFields.file.required()
}).required()

export const coverImg = Joi.object().keys({
    file:generalFields.file.required()
}).required()
