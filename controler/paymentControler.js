const catchAsyncErrors=require("../middleware/catchAsyncErr")
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51NcTJ4SHy2c8RzPKsSM5p0IYU20rLMoxCqpf1TgZ4zz3VxLHooO3IK0ZMTnMMPsZ1pT2SMrmnXh0P3d7A0ctA4l400uuXLJkAd");
// const stripeCode=(process.env.STRIPE_SECRET_KEY);

exports.processPayment=catchAsyncErrors(async(req,res,next)=>{
    const {amount} = req.body; 
    
    try{
        console.log(req.body);
        // if (!amount ) {
        //     return res.status(400).json({ success: false, message: 'Invalid amount provided' });
        //   }
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
   res.status(200).json({stripeApiKey:process.env.STRIPE_API_KEY})
})
