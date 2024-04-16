const app=require("./app")
const express=require("express")
const dotenv=require("dotenv")
const connectDatabase=require("./config/database")
const cloudinary=require("cloudinary").v2; 

//config 
dotenv.config({path:"backend/config/config.env"});
//connect to database
connectDatabase();
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
