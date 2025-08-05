import express from "express";
import {
  createStory,
  getStories,
  deleteStory,
} from "../controllers/storyController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multermiddleware.js";
const router = express.Router();

router.route("/create").post(verifyJWT, upload.single("content"), createStory);
router.route("/getstories").get(verifyJWT, getStories);
router.route("/delete/:id").delete(verifyJWT, deleteStory);

export default router;
