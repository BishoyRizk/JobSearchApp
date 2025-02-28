import path from 'node:path'
import * as dotenv from 'dotenv'



dotenv.config({path:path.resolve('./src/config/.env')})

import * as cloudinary from 'cloudinary'


cloudinary.v2.config({
    secure:true,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
    cloud_name:process.env.cloud_name
})

export default cloudinary.v2