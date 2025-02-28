import  bootstrap  from './src/app.controller.js'
import  express  from 'express'
import * as dotenv from 'dotenv'
import path from 'node:path'
// cronSchedule
import './src/modules/auth/service/cronSchedule.js'

const socketConnections = new Map()

import { Server } from 'socket.io'
import { authenticationSocket } from './src/middleware/auth.middleware.js'
import { runIo } from './src/modules/chat/socket.controllet.js'

dotenv.config({path:path.resolve('./src/config/.env')})
const app = express()
const port = process.env.PORT||5000

bootstrap(app , express)
const httpServer=app.listen(port, () => console.log(`Example app listening on port ${port}!`))



runIo(httpServer)



