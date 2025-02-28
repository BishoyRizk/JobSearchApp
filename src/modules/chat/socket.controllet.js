import { Server } from "socket.io"
import { LogOutSocket, registerSocket } from "./service/chat.auth.service.js"
import { handleChat } from "./service/chat.service.js"
export let io
export const runIo = async(httpServer)=>{
     io = new Server(httpServer,{
        cors:'*'
    })



       
    return   io.on('connection',async(socket)=>{
           await registerSocket(socket)
            await handleChat(socket)
           await LogOutSocket(socket)
       })
       

}