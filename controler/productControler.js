const product=require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr=require("../middleware/catchAsyncErr");
const ApiFeatures = require("../utils/apifeatures");
// const cloudinary =require("../server");

const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary with your configuration
cloudinary.config({
  cloud_name: 'dipu7jalt',
  api_key: '918886422775242',
  api_secret: 'pN38jbcBzDyjOFmWYZJQcS391GY'
});

//create product
exports.createProduct=catchAsyncErr(async(req,res,next)=>{
     let images=[];
     const img_url=req.body.images;
    if (typeof req.body.images === "string"){
             images.push(req.body.images);
        
        }else{
            images = req.body.images;
        }
    
try {
     const imagesLinks=[];
      
    const result=await cloudinary.uploader.upload(img_url,{folder:"avatars"})
        
     imagesLinks.push({public_id:result.public_id,url:result.secure_url})
    
     req.body.images=imagesLinks;
    req.body.user = req.user.id;
    
    const Product=await product.create(req.body)
    console.log(Product);

    res.status(201).json({
        success:true,
        Product,

    })
}
catch(error){
    console.error("Error creating product or uploading images:", error);
    res.status(500).json({ success: false, message: "Failed to create product or upload images" });

}
}
);


//GET ALL PRODUCTS
exports.getAllProducts= catchAsyncErr(async(req,res)=>{
     let resultPerPage=9;
     let productCount=await product.countDocuments();
    let apifeatures=new ApiFeatures(product.find(),req.query || req.query.keyword)
    .search()
    .filter()
    let Product= await apifeatures.query;
    // console.log(Product);
    let filteredProductCount=Product.length;
    apifeatures.pagination(resultPerPage);

     Product;
res.status(200).json({
        success:true,
        Product,
        productCount,
        resultPerPage,
        filteredProductCount,
    })
}
);
//get all products(admin)
exports.getAdminProducts= catchAsyncErr(async(req,res)=>{
   const  Product= await product.find();
res.status(200).json({
       success:true,
       Product,
      
   })
}
);
//GET PRODUCT DETAILS
exports.getProductDetails=catchAsyncErr(async(req,res,next)=>{
    let Product=await product.findById(req.params.id.trim());
    if(!Product){
        return next(new ErrorHandler("Product Not Found",404))        
    }
res.status(200).json({
        success:true,
        Product,
        
    })
console.log(Product);
}
);
//update product----Admin
exports.updateProduct=catchAsyncErr(async(req,res,next)=>{
    let Product=await product.findById(req.params.id.trim());
    // console.log(Product);

    if(!Product){
        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }
    let images=[];
    if(typeof req.body.images ==="string"){
        images.push(req.body.images)
    }
    else{
        images=req.body.images;
    } 
    if(images !==undefined){
        for(let i=0;i<images.length;i++){
            const result=await cloudinary.v2.uploader.upload(images[i].public_id)
        }
        const imagesLinks=[];
    for(let i=0;i<images.length;i++){
        const result=await cloudinary.uploader.upload(images[i],{folder:"products"})
        
        imagesLinks.push({public_id:result.public_id,url:result.secure_url})
    }
    req.body.images=imagesLinks;
    }

 let Productup=await product.findByIdAndUpdate(req.params.id.trim(),req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
     })
     console.log(req.body)
     if(!Productup){
        console.log("productup not found");
     }
     
    res.status(200).json({
        success:true,
        Product:Productup,
    })
}
);
//DELETE PRODUCT
exports.deleteProduct=catchAsyncErr(async(req,res)=>{
    const Product=await product.findById(req.params.id.trim());
    console.log(Product)
    if(!Product){
        return res.status(500).json({
            success:false,
            message:"product not found"
        })
        
    }
    // for (let i = 0; i < product.images.length; i++) {
    // await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        
    // }
    await Product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
}
);


//create the review or update the review
exports.createProductReview=catchAsyncErr(async(req,res,next)=>{
    const {productId,rating,comment}=req.body;
    const review={
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    console.log(req.body)
    const Product=await product.findById(productId);
    
    const isReviewed=Product.reviews.find((rev)=>rev.user.toString()===req.user.id.toString())
    if(isReviewed){
Product.reviews.forEach((rev) => {
    if(rev.user.toString()===req.user.id.toString())(rev.rating=rating),(rev.comment=comment)
});
    }
    else{
        Product.reviews.push(review)
        Product.numOfReviews=Product.reviews.length
        // console.log(reviews);
    }
    let avg=0;
    Product.reviews.forEach((rev)=>{
        avg+=rev.rating
    })
    Product.ratings=avg/Product.reviews.length;
         console.log(Product.ratings);
    await Product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
}
)
//  Get all reviews of product 
exports.getProductReviews=catchAsyncErr(async(req,res,next)=>{
    const Product=await product.findById(req.query.id)
    if(!Product){
        return next(new ErrorHandler("product not found",404))
    }
    console.log(Product);
    res.status(200).json({
        success:true,
        reviews:Product.reviews,
    })
})
//Delete reviews 
exports.deleteReview=catchAsyncErr(async(req,res,next)=>{
const Product=await product.findById(req.query.productId)
if(!Product){
    return next(new ErrorHandler("Product Not Found",404))
}
const reviews=Product.reviews.filter(rev=>rev._id!==req.query.id)
let avg=0;
reviews.forEach((rev)=>{
    avg+=rev.rating;
})
let ratings=0;
if(reviews.length===0){
    ratings=0;
}
else{
 ratings=avg/reviews.length;
}
console.log(reviews)
const numberOfReviews=reviews.length;
await product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numberOfReviews},
{new:true,runValidators:true,useFindAndModify:false})
res.status(200).json({success:true})
})