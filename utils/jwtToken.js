//creating token and saving in cookie
const sendToken=(user,statusCode,res)=>{
const token=user.getJwtToken()
     .then((token)=>{
//option for cookie
      const options={
            expires:new Date(
               Date.now() + process.env.COOKIE_EXPIRE*24*60*60*10),
               httpOnly:true
};
    // const options= {httpOnly:true};
             
     res.status(statusCode).cookie('token',token,options).json({
         sucess:true,
         user,
         token,
     });
     return token; 
    }).catch((err)=>{
        console.log("token is not a string")
        }) 
 }

 module.exports=sendToken;