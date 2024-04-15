const mongoose=require("mongoose")
DB_URI="mongodb://localhost:27017/Ecommerce";

const connectDatabase=()=>{

mongoose.connect(DB_URI)
.then((data)=>console.log(`database is connected:${data.connection.host}`))
.catch((err)=>console.log(err))
}
module.exports=connectDatabase 
