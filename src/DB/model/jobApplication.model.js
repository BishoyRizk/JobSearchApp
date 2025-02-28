import mongoose, { model, Schema, Types } from "mongoose";

export const statusTypes = {
    pending:'pending',
    accepted:'accepted',
    viewed:'viewed',
    in_consideration:'in_consideration',
    rejected:'rejected'
}

const jobApplicationSchema = new Schema({
    jobId:{
        type:Types.ObjectId,
        ref:'Job',
        required:true

    },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    userCv:{
        secure_url:{type:String},
        public_id:{type:String},

    },
    status:{
        enum: Object.values(statusTypes),
        default:statusTypes.pending,
        type:String
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

// jobApplicationSchema.virtual('users',{
//     localField:'userId',
//     foreignField:'_id',
//     ref:"User"
// })


export const CVModel = mongoose.models.Cv || model('Cv',jobApplicationSchema)