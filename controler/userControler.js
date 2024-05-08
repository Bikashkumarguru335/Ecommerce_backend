const ErrorHandler=require("../utils/errorHandler")
const catchAsyncErr=require("../middleware/catchAsyncErr")
const User=require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const { validate } = require("../model/userModel");
const sendEmail=require("../utils/sendEmail.js")
const crypto=require("crypto");
const cloudinary=require("cloudinary")

//Register a user
exports.registerUser=catchAsyncErr(async(req,res,next)=>{

    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    });
    const {name,email,password}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
    },
    });
    sendToken(user,201,res); 

 })
 //login user
 exports.loginUser=catchAsyncErr(async(req,res,next)=>{
    const{email,password}=req.body;
    //checking if user has given password and email both
    if(!email ||!password){
        return next(new ErrorHandler("please enter email & password",400));
    }
    const user= await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("invalid email or password",401))
    }
    //compareing  password for login
    const isPasswordMatch= await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new ErrorHandler("invalid password",401))
    }
    sendToken(user,200,res); 
})
//logout user
exports.logout=catchAsyncErr(async(req,res,next)=>{
    res.cookie("token",null,{
         expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({ 
        success:true,
        message:"Logged Out"
    });
});
//forgot password
exports.forgotPassword=catchAsyncErr(async(req,res,next)=>{
    console.log({email:req.body.email})
    // const email=
 const user=await User.findOne({email:req.body.email});
console.log(user)

if(!user){
    return next(new ErrorHandler("user not found",404));
    }
    //get reset password token
   const resetToken=user.getResetPasswordToken();
await user.save({validateBeforeSave:false})
const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
const message=`your reset password token is :-\n\n ${resetPasswordUrl} \n\n 
if you have not requested this email then, please ignore it`;
try{
await sendEmail({
email:user.email,
subject:"Ecommerce password recovery",
message,
}) 
res.status(200).json({
    success:true,
    message:`email sent to ${user.email} successfully`,
});
}
catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500))
}
})
//reset password
exports.resetPassword=catchAsyncErr(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired",404));
    }
    if(req.body.password !==req.body.confirmPassword){
        return next(new ErrorHandler("password does not password",400))
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    console.log(user)
    sendToken(user,200,res)
})
//get user details 
exports.getuserDetails=catchAsyncErr(async(req,res,next)=>{
    const user=await User.findById(req.user);
    sendToken(user,200,res)
})
//update user password
exports.updatePassword=catchAsyncErr(async(req,res,next)=>{
    const user=await User.findById(req.user).select("+password");
    const isPasswordMatch=await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatch){
        return next(new ErrorHandler("error password is incorrect",400))

    }
    if(req.body.newPassword !==req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400))
    }
    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
    })
    //update user profile
    exports.updateProfile=catchAsyncErr(async(req,res,next)=>{
        const newUserData={
            name:req.body.name,
            email:req.body.email
        };
        // added cloudinary 
        if(req.body.avatar!==""){
            const user=await User.findById(req.user.id)
            const imageId=user.avatar.public_id
            await cloudinary.v2.uploader.destroy(imageId)
            const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
                folder:"avatars",
                width:150,
                crop:"scale"
            });
            newUserData.avatar={
                public_id:myCloud.public_id,
                url:myCloud.secure_url,
        }
        }
        const user= await User.findByIdAndUpdate(req.user,newUserData,{
            new:true,
            runValidators:true,
            useFindAndModify:true,
        })
        res.status(200).json({
            success:true,
            user
        })
    });
    //get all user(admin)
    exports.getAllUser=catchAsyncErr(async(req,res,next)=>{
        const users=await User.find();
res.status(200).json({
            success:true,
            users,
        })
    })
    //get single user(admin)
    exports.getSingleUser=catchAsyncErr(async(req,res,next)=>{
        const user=await User.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler(`user does not exits with id:${req.params.id}`))
        }
        res.status(200).json({
            success:true,
            user,
        })
    })
    //update user role(not working)
    exports.updateUserRole=catchAsyncErr(async(req,res,next)=>{
        const newUserData={
            name:req.body.name,
            email:req.body.email,
            role:req.body.role,
        };
        
    const user= await User.findByIdAndUpdate((req.params.id),newUserData,{
            new:true,
            runValidators:true,
            useFindAndModified:false,
            
        })
        console.log(req.params.id);
        res.status(200).json({
            success:true,
            user,
        })
    });
    //Delete user ---Admin
    exports.deleteUser=catchAsyncErr(async(req,res,next)=>{
        const user=await User.findById(req.params.id);
       
        
        if(!user){
            return next(new ErrorHandler(`user does not exists with id:${req.params.id}`))
        }
        const imageId=user.avatar.public_id
            await cloudinary.uploader.destroy(imageId)
        await user.remove();
                res.status(200).json({
            success:true,
            message:"user deleted successfully"
        })
    });

