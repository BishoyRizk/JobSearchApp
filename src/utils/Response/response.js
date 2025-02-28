


export const successResponse = ({res,message='Done',status=200,data={}}={})=>{
    return res.status(status).json({message,data})
}