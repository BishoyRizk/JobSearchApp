import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";



export const createCompany = Joi.object().keys({
    companyName:generalFields.company.required()
    ,companyEmail:generalFields.emailCompany.required()
    ,description:generalFields.company.required()
    ,address:generalFields.company.required()
    ,industry:generalFields.company.required()
}).required()


export const updateCompany = Joi.object().keys({
    companyName:generalFields.company
    ,companyEmail:generalFields.emailCompany.required()
    ,description:generalFields.company,
    Hr:generalFields.id
    ,address:generalFields.company
    ,industry:generalFields.company,
    file:generalFields.file,
    numberOfEmployees:Joi.number().positive().min(18).max(23)
}).required()


export const deleteCompany = Joi.object().keys({
    companyId:generalFields.id.required()
}).required()


export const getCompany = Joi.object().keys({
    companyName:generalFields.company.required()
}).required()
export const getCompanyById = Joi.object().keys({
    companyId:generalFields.id.required()
}).required()



export const updateLogo = Joi.object().keys({
    companyId:generalFields.id.required(),
    file:generalFields.file.required()

}).required()


export const updateCover = Joi.object().keys({
    companyId:generalFields.id.required(),
    file:generalFields.file.required()

}).required()


export const deleteLogo = Joi.object().keys({
    companyId:generalFields.id.required(),
    

}).required()


export const deleteCover = Joi.object().keys({
    companyId:generalFields.id.required(),
    

}).required()



export const addHr = Joi.object().keys({
    companyId:generalFields.id.required(),
    userId:generalFields.id.required(),

}).required()