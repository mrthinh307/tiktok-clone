import { StatusCodes } from "http-status-codes";
import FollowService from "~/services/followings.service";

class FollowingsController {
  async getFollowings(req: any, res: any) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const page = isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    const followingsPerPage = 15;

    try {
      const result = await FollowService.getFollowingsByUser(
        userId,
        page,
        followingsPerPage
      );

      res.status(StatusCodes.OK).json({
        data: result.following_ids,
        follower_id: result.follower_id,
        meta: {
          pagination: {
            page,
            followingsPerPage,
            ...result.meta,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching followings:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  }
}

export default new FollowingsController();
