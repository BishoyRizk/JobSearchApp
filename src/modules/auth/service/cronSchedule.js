import * as dbService from '../../../DB/dbService.js'
import cron from 'node-cron'
import { userModel } from '../../../DB/model/User.model.js'

export const deleteExpiredOTP = async()=>{
    try {
        const currentDate = new Date()
        await dbService.updateMany({
            model:userModel,
            filter:{},
            data:{
                $pull : {OTP:{expiresIn:{$lt:currentDate}}}
            }
        })

        console.log('expired OTP Deleted');
        
    } catch (error) {
        console.log('cron ' + error);
        
    }
}

cron.schedule('0 */6 * * *',()=>{
    deleteExpiredOTP()
})