const mongoose=require("mongoose")
const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter The Product"]
    },
    description:{
        type:String,
        required:[true,'Please Enter The Product Descprition']
    },
    price:{
        type:Number,
        required:[true,"Please Enter The Price"],
        maxLength:[6,"Price Can Not Be Exceed 8 Character"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"Please Enter The Product Category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter The Product Stock"],
        maxLength:[4,"Stock can not be exceed more than 4 character"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true,
        },
        name:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true
    }
}],
user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true,
},
createdAt:{
    type:Date,
    default:Date.now
}


})
module.exports=mongoose.model("product",productSchema);