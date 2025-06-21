import express from "express";
import videosController from "~/controllers/videos.controller";
import { authenticateOptional } from "~/middlewares/authenMiddleware";

const router = express.Router();

// [GET] /api/v1/videos?type=for-you|following
router.get("/", authenticateOptional, (req: any, res: any) => {
  const type = req.query.type;

  if (type === "following") {
    // Kiểm tra xem user đã đăng nhập chưa
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required to get following videos",
      });
    }
    return videosController.getFollowingVideos(req, res);
  } else {
    // Mặc định là for-you
    return videosController.getForYouVideos(req, res);
  }
});

export default router;
