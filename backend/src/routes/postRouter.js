import { Router } from "express";
import {
  addNewPost,
  getAllPost,
  getUserPost,
  getSinglePost,
  editePost,
  likeUnlikePost,
  deletePost,
  bookmarkPost,
} from "../controllers/postController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multermiddleware.js";

const router = Router();

router
  .route("/addnewpost")
  .post(verifyJWT, upload.single("contant"), addNewPost);
router.route("/getallposts").get(verifyJWT, getAllPost);
router.route("/getuserpost").get(verifyJWT, getUserPost);
router
  .route("/editepost/:postId")
  .patch(verifyJWT, upload.single("contant"), editePost);
router.route("/getsinglepost/:postId").get(verifyJWT, getSinglePost);
router.route("/likeunlike/:postId").post(verifyJWT, likeUnlikePost);
router.route("/deletepost/:postId").delete(verifyJWT, deletePost);
router.route("/bookmarkpost/:postId").post(verifyJWT, bookmarkPost);

export default router;
