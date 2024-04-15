const express=require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails,
 createProductReview, getProductReviews, deleteReview, getAdminProducts } = require("../controler/productControler");
const { isAuthenticationUser, authorizeRoles} = require("../middleware/auth");
const router=express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticationUser,authorizeRoles("admin"),getAdminProducts)
router.route("/admin/products/new").post(isAuthenticationUser,createProduct)
router.route("/admin/products/:id").put(updateProduct)
.delete(isAuthenticationUser, authorizeRoles("admin"),deleteProduct)
router.route("/products/:id").get(getProductDetails)
router.route("/review").put(isAuthenticationUser,createProductReview)
router.route("/reviews").get(getProductReviews)
 .delete(isAuthenticationUser,deleteReview)

module.exports=router