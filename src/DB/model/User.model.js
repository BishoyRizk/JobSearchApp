import mongoose, { model, Schema, Types } from "mongoose"
import {generateHash} from '../../utils/security/hashing/hash.js'
import {generateDecryption, generateEncryption} from '../../utils/security/encryption/enc.js'
import * as dbService from '../dbService.js'
import {companyModel} from './company.model.js'
import {jobModel} from './job.model.js'
export const genderTypes = {
    male:'male',
    female:'female'
}
export const roleTypes = {
    user:'user',
    admin:'admin'
}
export const providerTypes = {
    google:'google',
    system:'system'
}

export const socketConnections = new Map()

const userSchema = new Schema({
    firstName:{
        type:String,
        
    },
    lastName:{
        type:String,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
        
    },
    gender:{
        type:String,
        enum:Object.values(genderTypes),
        default: genderTypes.male
    },
    DOB:{
        type:Date,
        validate:{
            validator :function(value){
            const currentDate = new Date()
            const age = currentDate.getFullYear() - value.getFullYear()
            return value < currentDate &&  age >= 18
        },message:'DOB must be a valid date, older than the current date, and age must be 18 or above'}
    },
    phone:{
        type:String,
        // unique:true
    },
    role:{
        type:String,
        enum:Object.values(roleTypes),
        default:roleTypes.user
    },
    provider:{
        type:String,
        enum:Object.values(providerTypes),
        default:providerTypes.system
        
    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    isDeleted:Date,
    isBanned:Date,
    changeCredentialTime :Date,
    profilePic:{
        secure_url:{type:String},
        public_id:{type:String},
    },
    coverPic:{
        secure_url:{type:String},
        public_id:{type:String},
    },
    OTP: [
        {
          code: { type: String, required: true },
          type: { type: String, enum: ['confirmEmail', 'forgetPassword','resetPassword'], required: true },
          expiresIn: { type: Date, required: true }
        }
      ]
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

userSchema.virtual('userName').set(function(value){
    this.firstName= value.split(' ')[0]
    this.lastName= value.split(' ')[1]
}).get(function(){
    return `${this.firstName || ''} ${this.lastName || ''}`.trim()
})

userSchema.pre('save',function(next){
    if (this.provider==providerTypes.system) {
        console.log('system');
        
        if (this.password) {
            console.log('pass');
            
            this.password = generateHash({plainText:this.password})
        }
       
        if (this.phone) {
            this.phone = generateEncryption({plainText:this.phone})
        }
    }
   next()
})

userSchema.post('updateOne',async function(doc){
   
    if (this.getQuery().isDeleted && this.getQuery()._id) {
       console.log(this.getQuery()._id);
       
       await dbService.updateMany({
        model:companyModel,
        filter:{
            createdBy: this.getQuery()._id
        },data:{
            deletedAt:Date.now()
        }
       })

       await dbService.updateMany({
        model:jobModel,
        filter:{
            addedBy:this.getQuery()._id
        },data:{
            closed:true
        }
       })
        
    }
    
    
    
})

userSchema.post('findOne',function(doc){
    if(!doc) return
    
    doc.phone = generateDecryption({cipherText:doc.phone})
})


export const userModel = mongoose.models.User || model('User',userSchema)