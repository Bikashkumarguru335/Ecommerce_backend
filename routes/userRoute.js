const express=require("express")
const {registerUser, loginUser,fetchProtectedResource, logout, forgotPassword, resetPassword,
     getuserDetails, updatePassword, updateProfile, getAllUser, 
     getSingleUser, updateUserRole, deleteUser}=require("../controler/userControler")

const{isAuthenticationUser,authorizeRoles}=require("../middleware/auth")
const router=express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/protected").get(isAuthenticationUser,fetchProtectedResource)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticationUser,getuserDetails)
router.route("/password/update").put(isAuthenticationUser,updatePassword);
router.route("/me/update").put(isAuthenticationUser,updateProfile);
router.route("/admin/users").get(isAuthenticationUser,authorizeRoles("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticationUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticationUser,authorizeRoles("admin"),updateUserRole)
.delete(isAuthenticationUser,authorizeRoles("admin"),deleteUser)

module.exports=router;
