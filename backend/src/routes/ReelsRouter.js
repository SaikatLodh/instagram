import { Router } from "express";
import {
  addNewReels,
  getAllReels,
  getUserReels,
  getSingleReels,
  editeReels,
  likeUnlikeReels,
  deleteReels,
  bookmarkReels,
} from "../controllers/ReelsController.js";
import { upload } from "../middleware/multermiddleware.js";
import { verifyJWT } from "../middleware/authenticationMiddleware.js";

const router = Router();

router
  .route("/addnewpost")
  .post(verifyJWT, upload.single("contant"), addNewReels);
router.route("/getallposts").get(verifyJWT, getAllReels);
router.route("/getuserpost").get(verifyJWT, getUserReels);
router
  .route("/editepost/:reelsId")
  .patch(verifyJWT, upload.single("contant"), editeReels);
router.route("/getsinglepost/:reelsId").get(verifyJWT, getSingleReels);
router.route("/likeunlike/:reelsId").post(verifyJWT, likeUnlikeReels);
router.route("/deletepost/:reelsId").delete(verifyJWT, deleteReels);
router.route("/bookmarkpost/:reelsId").post(verifyJWT, bookmarkReels);

export default router;
