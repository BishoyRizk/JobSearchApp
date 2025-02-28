import mongoose, { model, Schema, Types } from "mongoose";
import * as dbService from '../dbService.js'
import {jobModel} from './job.model.js'


const companySchema = new Schema({
    companyName :{
        required:true,
        type:String,
        unique:true
    },
    companyEmail :{
        required:true,
        type:String,
        unique:true
    },
    description :{
        required:true,
        type:String,
      
    },
    address :{
        required:true,
        type:String,
      
    },
    industry  :{
        required:true,
        type:String,
      
    },
    numberOfEmployees  :{
        // required:true,
        type:Number,
        min:18,
        max:23
      
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    Logo :{
        secure_url:{type:String},
        public_id:{type:String},
    },
    coverPic:{
        secure_url:{type:String},
        public_id:{type:String},
    },
    HR:[{type:Types.ObjectId,ref:'User'}],
    bannedAt:Date,
    deletedAt:Date,
    legalAttachment :{
        secure_url:{type:String},
        public_id:{type:String},
    },
    approvedByAdmin :{
        type:Boolean,
        default:false
    }
    
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

companySchema.virtual('jobs',{
    localField:'_id',
    foreignField:'companyId',
    ref:'Job'
})

companySchema.post('updateOne',async function(doc){
    
    if ( this.getQuery()._id ) {

       await dbService.updateMany({
        model:jobModel,
        filter:{
            companyId:this.getQuery()._id
        },data:{
            closed:true
        }
       }) 

        
    }
    
    
})





export const companyModel = mongoose.models.Company || model('Company',companySchema)