const dotenv=require("dotenv")
dotenv.config({path:"config/config.env"});
const mongoose=require("mongoose")
mongoose.set('strictQuery', false);

const connectDatabase=()=>{

    const DB_URI = process.env.DB_URI; // Load MongoDB URI from environment variables
    if (!DB_URI) {
      console.error("MongoDB URI is not defined.");
      return; // Exit function if URI is not defined
    }
  mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
.then((data)=>console.log(`database is connected:${data.connection.host}`))
.catch((err)=>console.log(err))
}
module.exports=connectDatabase 
