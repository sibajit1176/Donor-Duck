const errorMiddleware=(err,req,res,next)=>{
    console.log(err);
    const statusCode=err.statusCode
    res.status(statusCode).json({
        success:false,
        message:err.message || "Internal Server Error",
        err:process.env.NODE_ENV === "development" ? err.stack : undefined,
    })
    
}

module.exports=errorMiddleware