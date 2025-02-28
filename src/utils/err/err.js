
export const asyncHandler=(fn)=>{
    return(req,res,next)=>{
        fn(req,res,next).catch(err=>{
            err.status=500
            return next(err)
        })
    }
}


export const globalErrorHandling=(error,req,res,next)=>{
    return res.status(error.cause||400).json({errMessage:error.message,stack:error.stack})
}