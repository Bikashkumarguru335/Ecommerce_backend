 const express=require("express");
const { isAuthenticationUser } = require("../middleware/auth");
const {processPayment,sendStripeApiKey}=require("../controler/paymentControler")
 const router=express.Router();
router.route("/payment/process").post(isAuthenticationUser,processPayment)
router.route("/stripeapikey").get(isAuthenticationUser,sendStripeApiKey)

 
 module.exports=router;