const express=require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controler/orderControler");
const router=express.Router();

const{isAuthenticationUser,authorizeRoles}=require("../middleware/auth")

router.route("/order/new").post(isAuthenticationUser,newOrder)
router.route("/order/:id").get(isAuthenticationUser,authorizeRoles("admin"),getSingleOrder)
router.route("/orders/me").get(isAuthenticationUser,myOrders)

router.route("/admin/orders").get(isAuthenticationUser,authorizeRoles("admin"),getAllOrders)
router.route("/admin/order/:id").put(isAuthenticationUser,authorizeRoles("admin"),updateOrder)
.delete(isAuthenticationUser,authorizeRoles("admin"),deleteOrder)
module.exports=router;