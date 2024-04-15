const ErrorHandler=require("../utils/errorHandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Enternal Server Error";
    
    //wrong mongodb  id error
    if(err.name==="CastError"){
        const message=`resource not found invalid:${err.path}`
        err=new ErrorHandler(message,400);
    }
    //Mongoose duplicate key error
    if(err.code===11000){
        const message=`duplicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHandler(message,400);
    }
    
// wrong jwt error
if(err.name==='JsonWebTokenError'){
const message=`${err.message}`;
err=new ErrorHandler(message,400);
}
//jwt expire error
if(err.name==='TokenExpiredError'){
    const message="Json web token is Expired,try again";
    err=new ErrorHandler(message,400);
    }
res.status(err.statusCode).json({
    sucess:false,
    message:err.message,
})
} 