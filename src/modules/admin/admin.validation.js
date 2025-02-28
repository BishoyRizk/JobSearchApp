import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const banUser = Joi.object().keys({
    userId:generalFields.id.required(),
    
    action:generalFields.action.required()
}).required()
export const banCompany = Joi.object().keys({
    companyId:generalFields.id.required(),
    
    action:generalFields.action.required()
}).required()
export const approved = Joi.object().keys({
    companyId:generalFields.id.required(),
    
    
}).required()