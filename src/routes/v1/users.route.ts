import express from "express";
import usersController from "~/controllers/users.controller";

const router = express.Router();

// POST /api/v1/users/:userId/follow - Follow một user
router.post("/:userId/follow", usersController.followUser);

// POST /api/v1/users/:userId/unfollow - Unfollow một user  
router.post("/:userId/unfollow", usersController.unfollowUser);

// POST /api/v1/users/:videoId/like - Thích một video
router.post("/:videoId/like", usersController.likeVideo);

// POST /api/v1/users/:videoId/unlike - Bỏ thích một video
router.post("/:videoId/unlike", usersController.cancelLikeVideo);

export default router;

