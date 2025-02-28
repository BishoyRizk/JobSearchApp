import { socketConnections } from "../../../DB/model/User.model.js"
import { authenticationSocket } from "../../../middleware/auth.middleware.js"

export const registerSocket = async(socket)=>{
    const {data} = await authenticationSocket({socket})
    if (!data.valid) {
       return socket.emit('socketErr',data)
    }
    socketConnections.set(data.user._id.toString(),socket.id)
   
    return 'Done'
   }
 export   const LogOutSocket = async(socket)=>{
       socket.on('disconnect',async()=>{
           const {data} = await authenticationSocket({socket})
           if (!data.valid) {
              return socket.emit('socketErr',data)
           }
           socketConnections.delete(data.user._id.toString(),socket.id)
          
           return 'Done'
       })
   
   }