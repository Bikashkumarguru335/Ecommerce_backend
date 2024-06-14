const express=require("express")
const app=express();
const errorMiddlewares=require("./middleware/error")
const ErrorHandler=require("./utils/errorHandler")
const cookieParser=require("cookie-parser")
const bodyparser=require("body-parser")
const cors=require('cors')
const product=require("./routes/productRoute")
const user=require("./routes/userRoute");
const order=require("./routes/orderRoute")
const { parse } = require("dotenv");
const fileUpload = require("express-fileupload");
const paymentRoute=require("./routes/paymentRoute")
const dotenv=require("dotenv");

dotenv.config({path:"config/config.env"})

app.use(express.json({limit:"25mb"}));
app.use(express.static('public'));
app.use(cookieParser());
// const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(cors({
  origin: '*',
}));

// const corsOptions = {
//   origin:"https://main--incredible-zabaione-86a268.netlify.app",
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

// app.options('*',cors());

 app.use(bodyparser.urlencoded({extended:true}))
 app.use(fileUpload())
//route exports
app.use("/api/v1",product)
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",paymentRoute);
//middleware for error
app.use(errorMiddlewares)
app.get('/', (req, res) => {
    res.send('Hello, your service is live!');
});
module.exports=app;
