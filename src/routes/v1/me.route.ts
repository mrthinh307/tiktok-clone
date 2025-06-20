import express from "express";
import followingsController from "~/controllers/followings.controller";
import likesController from "~/controllers/likes.controller";

const router = express.Router();

router.get("/followings", followingsController.getFollowings);
router.get("/likes", likesController.getLikes);

export default router;

