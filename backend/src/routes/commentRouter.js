import { Router } from "express"
import { addComment, getCommentsOfPost } from "../controllers/commentController.js"
import { verifyJWT } from "../middleware/authmiddleware.js"

const router = Router()

router.route("/addcomment/:postId").post(verifyJWT,addComment)
router.route("/getcommentofpost/:postId").get(verifyJWT,getCommentsOfPost)

export default router