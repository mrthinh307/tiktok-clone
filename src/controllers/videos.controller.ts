import { StatusCodes } from "http-status-codes";
import videosService from "~/services/videos.service";

class VideosController {
  private parsePagination(req: any) {
    const page = isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    const videosPerPage = isNaN(parseInt(req.query.videosPerPage)) ? 10 : parseInt(req.query.videosPerPage);
    return { page, videosPerPage };
  }

  private handleSuccess(res: any, data: any, pagination: any) {
    res.status(StatusCodes.OK).json({
      data,
      meta: { pagination },
    });
  }

  private handleError(res: any, error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error?.message || "Internal Server Error",
    });
  }

  async getForYouVideos(req: any, res: any) {
    const { page, videosPerPage } = this.parsePagination(req);

    try {
      const result = await videosService.getPaginatedVideos(page, videosPerPage);
      this.handleSuccess(res, result.videos, {
        page,
        videosPerPage,
        ...result.meta,
      });
    } catch (err) {
      this.handleError(res, err);
    }
  }

  async getFollowingVideos(req: any, res: any) {
    const { page, videosPerPage } = this.parsePagination(req);
    const userId = req.user?.id;

    try {
      const result = await videosService.getFollowingVideos(userId, page, videosPerPage);
      this.handleSuccess(res, result.videos, {
        page,
        videosPerPage,
        ...result.meta,
      });
    } catch (err) {
      this.handleError(res, err);
    }
  }
}

export default new VideosController();
