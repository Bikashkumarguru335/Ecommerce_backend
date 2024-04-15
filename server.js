const app=require("./app")
const express=require("express")
const dotenv=require("dotenv")
const connectDatabase=require("./config/database")
const cloudinary=require("cloudinary").v2; 
//  const Stripe=require("stripe")
// const  Razorpay=require("razorpay")
// //handling uncaught exception or write anything which in not declare
//  process.on("uncaughtException",(err)=>{
//      console.log(`error:${err.message}`);
//      console.log('shutting down the server due to unCaught Exception')
//  process.exit(1);
//  })
//config 
dotenv.config({path:"backend/config/config.env"});
//connect to database
connectDatabase();
// stripe configuration
// exports.stripe=new Stripe(process.env.STRIPE_SECRET_KEY)
// const instance=new Razorpay({
//      key_id:process.env.RAZORPAY_API_KEY,
//      key_secret:process.env.RAZORPAY_API_SECRET,
// })
cloudinary.config(
    {
      cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    }
)
 const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})
//unhandeled promise rejection
process.on("unhandeledRejection",(error)=>{
    console.log(`Error:${err.message}`);
    console.log('shutting down the server due to unhandeled promise rejection')
server.close(()=>{
    process.exit(1); 
});
})
