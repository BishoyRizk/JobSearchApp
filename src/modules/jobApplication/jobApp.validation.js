import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const apply = Joi.object().keys({
    companyId:generalFields.id.required(),
    jobId:generalFields.id.required(),
    file:generalFields.file.required()
}).required()
export const status = Joi.object().keys({
    companyId:generalFields.id.required(),
    jobId:generalFields.id.required(),
    status:Joi.string().valid('viewed','accepted','in_consideration','rejected'),
    jobAppId:generalFields.id.required()
}).required()