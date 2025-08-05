import { Router } from "express"
import { sendMessage, getMessage, getChatlist  } from "../controllers/messageController.js"
import { verifyJWT } from "../middleware/authmiddleware.js"

const router = Router()

router.route("/sendmessage/:receiverId").post(verifyJWT,sendMessage)
router.route("/getmessage/:receiverId").get(verifyJWT, getMessage)
router.route("/getlatestchat").get(verifyJWT, getChatlist)

export default router