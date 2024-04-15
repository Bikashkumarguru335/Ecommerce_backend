const catchAsyncErrors=require("../middleware/catchAsyncErr")
const Stripe = require("stripe");
const dotenv=require("dotenv")
dotenv.config({path:"backend/config/config.env"});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



exports.processPayment=catchAsyncErrors(async(req,res,next)=>{
    const {amount} = req.body; 
    
    try{
            const numericAmount = Number(amount); // Convert 'amount' to a number

     console.log('Numeric amount:', numericAmount);
    const myPayment=await stripe.paymentIntents.create({
        amount:Math.round(numericAmount * 100),
        currency:"inr",
         metadata:{
             company:"Ecommerce"}
})
    console.log(amount)
    res.status(200).json({success:true,client_secret:myPayment.client_secret})
}
catch (error) {
    // Handle any errors that occur during the payment processing
    console.error("Payment processing error:", error);
    res.status(500).json({ success: false, error: "Payment processing error" });
  }
})
exports.sendStripeApiKey=catchAsyncErrors(async(req,res,next)=>{
    console.log(process.env.STRIPE_API_KEY)

   res.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY})
})
