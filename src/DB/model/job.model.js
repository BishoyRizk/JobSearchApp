import mongoose, { model, Schema, Types } from "mongoose";

export const jobLocations={
    onSite:'onSite',
    remote:"remote",
    hybrid :'hybrid'
}

export const workTime = {
    part:'part-time',
    full:'full-time'
}
export const level = {
    junior:'junior',
    senior:'senior',
    fresh:'fresh',
    mid:'mid-level',
    lead:'team-lead',
    cto:'cto',
}

const jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:true
    },
    jobDescription:{
        type:String,
        required:true
    },
    jobLocation:{
        type:String,
        enum: Object.values(jobLocations),
        required:true
    },
    workingTime :{
        type:String,
        enum:Object.values(workTime),
        required:true
    },
    seniorityLevel  :{
        type:String,
        enum:Object.values(level),
        required:true
    },
    technicalSkills:[String],
    softSkills :[String],
    addedBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},
    closed:{
        type:Boolean,
        default:false
    },
    companyId:{type:Types.ObjectId,ref:'Company'}

},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

jobSchema.virtual('applications',{
    localField:'_id',
    foreignField:'jobId',
    ref:'Cv'
})


export const jobModel = mongoose.models.Job || model('Job',jobSchema)