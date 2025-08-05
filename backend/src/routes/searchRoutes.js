import express from "express";
import { searchUser } from "../controllers/searchController.js";
import { verifyJWT } from "../middleware/authenticationMiddleware.js";
const router = express.Router();

router.route("/searchuser").get(verifyJWT, searchUser);

export default router;
