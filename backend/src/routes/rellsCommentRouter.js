import { Router } from "express";
import {
  addReelsComment,
  getCommentsOfReels,
} from "../controllers/reelsCommentController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";


const router = Router();

router.route("/addcomment/:reelsId").post(verifyJWT, addReelsComment);
router.route("/getcommentofpost/:reelsId").get(verifyJWT, getCommentsOfReels);

export default router;
