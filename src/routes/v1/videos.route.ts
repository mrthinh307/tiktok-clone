import express from "express";
import videosController from "~/controllers/videos.controller";

const router = express.Router();

router.get("/", videosController.getVideos);

export default router;

