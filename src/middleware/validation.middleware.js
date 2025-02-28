
import joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../DB/model/User.model.js";

const checkObjectId = (value,helper)=>{
    return Types.ObjectId.isValid(value) ? true : helper.message('in-valid objectId')
}



export const fileObject = {
    fieldname: joi.string(),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    destination: joi.string(),
    filename: joi.string(),
    path: joi.string(),
    size: joi.number()
}
export const generalFields = {
    userName:joi.string().min(2).max(25).trim(),
    company:joi.string().min(2).max(25).trim(),

    

    job:joi.string().min(2).max(25).trim(),
    jobDesc:joi.string().min(2).max(200).trim(),

    jobArray: joi.array().items(joi.string()).min(1),
    email:joi.string().email({tlds:{allow:['com','net']},minDomainSegments:2,maxDomainSegments:3}),

    emailCompany:joi.string().email({tlds:{allow:['net']},minDomainSegments:2,maxDomainSegments:3}),

    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword:joi.string().valid(joi.ref('password')),

    code:joi.string().pattern(new RegExp(/^[\d]{7}$/)),
    DOB:joi.date().less('now'),

    action:joi.string().valid('ban','unban'),
    gender:joi.string().valid(...Object.values(genderTypes)),
    id:joi.string().custom(checkObjectId),

    file:joi.object(fileObject),
    fileObject,
    phone:joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).messages({
        'string.pattern.base':'only egyptian numbers are allowed' }),     
}







export const validation=(schema)=>{
    return(req,res,next)=>{
        let inputDate = {...req.body,...req.params,...req.query}

        if (req.file || req.files) {
            inputDate.file = req.file || req.files
        }

        const check = schema.validate(inputDate,{abortEarly:false})

        if (check.error) {
            return res.status(400).json({message:check.error.details})
        }

        return next()
    }
}