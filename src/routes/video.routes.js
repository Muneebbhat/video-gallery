import { Router } from "express";
import { sendVideos } from "../controllers/video.controller.js";

const router = new Router();
router.route("/send").post(sendVideos);
export default router;
