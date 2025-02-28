import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const signup = Joi.object().keys({
    userName:generalFields.userName.required(),
    email:generalFields.email.required(),
    password:generalFields.userName.required(),
    confirmPassword:generalFields.confirmPassword.required(),
    DOB:generalFields.DOB,
    phone:generalFields.phone,
}).required()
export const login = Joi.object().keys({
    
    email:generalFields.email.required(),
    password:generalFields.userName.required(),
   
}).required()

export const confirm = Joi.object().keys({

    email:generalFields.email.required(),
    code:generalFields.code.required(),
   
}).required()


export const forgetPassword = Joi.object().keys({

    email:generalFields.email.required(),
    
   
}).required()
export const resetPassword = Joi.object().keys({

    email:generalFields.email.required(),
    newPassword:generalFields.password.required(),
    code:generalFields.code.required(),
    
    
   
}).required()