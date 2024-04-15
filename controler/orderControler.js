const Order=require("../model/orderModel");
const product=require("../model/productModel");
const user=require("../model/userModel")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr=require("../middleware/catchAsyncErr");

//create new order
exports.newOrder=catchAsyncErr(async(req,res,next)=>{
    try{
    const{
    shippingInfo,
    orderItems, 
    paymentInfo,
    itemPrice
    ,shippingPrice
    ,totalPrice}=req.body;
    console.log(req.body)    
    const order=await Order.create({
    shippingInfo,
    orderItems,
     paymentInfo,
    itemPrice
    ,shippingPrice
    ,totalPrice,
    paidAt:Date.now(),
    user:req.user,
    })
    console.log(order)
    res.status(201).json({
        success:true,
       order
    
    })
}catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }

})

//Get single order
exports.getSingleOrder=catchAsyncErr(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

//Get logged in user orders
exports.myOrders=catchAsyncErr(async(req,res,next)=>{
    const orders=await Order.find({user:req.user})

    res.status(200).json({
        sucess:true,
        orders
    })
})


//Get all orders---admin
exports.getAllOrders=catchAsyncErr(async(req,res,next)=>{
    const orders=await Order.find()

    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        sucess:true,
        totalAmount,
        orders
    })
})

//Update  orders status---admin
exports.updateOrder=catchAsyncErr(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("you have already delivered this order",400))
    }
    if(req.body.status==="Shipped"){
    order.orderItems.forEach(async(o)=>{
       await updateStock(o.products,o.quantity);
    })
}
    order.orderStatus=req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        
    })
})
async function updateStock(id,quantity){
    const products=await product.findById(id);

    product.Stock -=quantity;

    await products.save({validateBeforeSave:false})
}
//Delete orders---admin
exports.deleteOrder=catchAsyncErr(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }
   await order.remove();

    res.status(200).json({
        sucess:true,
        order
    })
})
