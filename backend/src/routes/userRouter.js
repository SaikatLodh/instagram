import { Router } from "express";
import {
  otpsend,
  verifyOtp,
  register,
  login,
  logout,
  getProfile,
  getotheruser,
  editProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  followOrUnfollow,
  getSuggestedUsers,
  getChatUser,
  checkUserLogin,
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multermiddleware.js";

const router = Router();

router.route("/otpsend").post(otpsend);
router.route("/verifyotp").post(verifyOtp);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT, logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:id").patch(resetPassword);
router.route("/getprofile").get(verifyJWT, getProfile);
router.route("/otheruserprofile/:otheruserId").get(verifyJWT, getotheruser);
router
  .route("/editeprofile")
  .patch(verifyJWT, upload.single("contant"), editProfile);
router.route("/updatepassword").patch(verifyJWT, updatePassword);
router.route("/followunfollow/:id").post(verifyJWT, followOrUnfollow);
router.route("/suggestuser").get(verifyJWT, getSuggestedUsers);
router.route("/getchatuser").get(verifyJWT, getChatUser);
router.route("/checkuserlogin").get(checkUserLogin);

export default router;
