const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const userSchema=new mongoose.Schema({
name:{
        type:String,
        require:[true,"Please Enter The Name"],
 
        maxLength:[30,"Name Can't Exceed More Than 30 Character"],
        minLength:[4,"Name should have More Than 4 Character"],
},
email:{
    type:String,
    required:[true,"Please Enter Your Email"],
    unique:true,
    validator:[validator.isEmail,"Please Enter a Valid Email"]
},
password:{
    type:String,
    required:[true,"Please Enter Your Password"],
    minLength:[8,"Password Should be geater Than 8 Character"],
    select:false,
},
avatar:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
},
createdAt:{
    type:Date,
    default:Date.now
},
role:{
    type:String,
    default:"user"
},
resetPasswordToken:String,
resetPasswordExpire:Date, 
})
 userSchema.pre("save",async function(next){
     if(!this.isModified("password")){
         next();
     }
     this.password=await bcrypt.hash(this.password,10)
 })
//jwt token
 userSchema.methods.getJwtToken= async function(){
    return await jwt.sign({id:this._id},process.env.JWT_SECRET)

     }

//compare password
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
// Generate Password Reset Token
userSchema.methods.getResetPasswordToken=function(){
    //generate token
    const resetToken=crypto.randomBytes(20).toString("hex");
    //hashing and adding reset password to usema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+ 15*60*1000;
    return resetToken;
}

module.exports=mongoose.model("User",userSchema)