import supabase from "../config/supabase";

class VideosController {
  async getVideos(req: any, res: any) {
    // Sử dụng giá trị mặc định nếu tham số không hợp lệ
    const page = isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    const videosPerPage = isNaN(parseInt(req.query.videosPerPage)) ? 10 : parseInt(req.query.videosPerPage);
    const offset = (page - 1) * videosPerPage;

    try {
      // Lấy tổng số bản ghi
      const { count } = await supabase
        .from("video")
        .select("*", { count: "exact", head: true });

      const totalPages = count ? Math.ceil(count / videosPerPage) : 0;
      const totalVideos = count ? count : 0;

      // Nếu offset vượt quá count, trả về mảng rỗng
      if (count && offset >= count) {
        return res.json({
          data: [],
          meta: {
            pagination: {
              page,
              videosPerPage,
              totalPages,
              totalVideos,
              hasNext: false,
              hasPrevious: false,
            },
          },
        });
      }

      // Truy vấn lấy video kèm user (JOIN ảo)
      const { data, error } = await supabase
        .from("video")
        .select(
          `
          *,
          user:user_id (
            *
          )
        `
        )
        .range(offset, offset + videosPerPage - 1);

      if (error) throw error;

      const hasNext = count ? offset + videosPerPage < count : false;
      const hasPrevious = offset > 0;

      res.json({
        data,
        meta: {
          pagination: {
            page,
            videosPerPage,
            totalPages,
            totalVideos,
            hasNext,
            hasPrevious,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new VideosController();
