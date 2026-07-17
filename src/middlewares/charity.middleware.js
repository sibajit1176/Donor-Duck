const charitymiddleware=(req,res,next)=>{
    try {
       if (!req.user) {
            const err = new Error("Unauthorized");
            err.statusCode = 401;
            return next(err);
        }
        if(req.user.role!='CHARITY' && req.user.role!='ADMIN'){
            const err=new Error("Forbidden: You do not have permission to access this resource.")
            err.statusCode=403
            console.log(req.user);
            
            return next(err);
        }
        next()

    } catch (error) {
        next(error)
    }
}

module.exports=charitymiddleware