import { connectDB } from './DB/connection.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import companyController from './modules/company/company.controller.js'
import adminController from './modules/admin/admin.controller.js'
import { globalErrorHandling } from './utils/err/err.js'
import { createHandler } from 'graphql-http/lib/use/express'
import {schema} from './modules/modules.js'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    limit:100,
    windowMs:5*60*1000,
    legacyHeaders:false,
    standardHeaders:'draft-8'
})

const bootstrap = (app, express) => {
    app.use(express.json())

    app.use(cors())
    app.use(helmet())

    //    graphQl
    app.use('/searchAppGraphQl',createHandler({schema}))
    // ##

    app.use('/auth',limiter)
    app.use('/user',limiter)
    app.use('/company',limiter)
    app.use('/admin',limiter)
    
    
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project powered by express and ES6" })
    })
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/company", companyController)
    app.use("/admin", adminController)
    

    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing" })
    })

    app.use(globalErrorHandling)


    // DB

   connectDB()




}

export default bootstrap