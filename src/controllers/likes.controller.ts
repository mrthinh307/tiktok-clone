import supabase from "~/config/supabase";

class LikesController {
  async getLikes(req: any, res: any) {
    // Lấy userId từ user đã được authenticate
    const userId = req.user?.id;

    if (!userId) {
      console.log("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    } else {
      console.log("User ID:", userId);
    }

    const page = isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    const likesPerPage = 10;
    const offset = (page - 1) * likesPerPage;

    try {
      // Lấy tổng số bản ghi
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const totalPages = count ? Math.ceil(count / likesPerPage) : 0;
      const totalLikes = count ? count : 0;

      // Nếu offset vượt quá count, trả về mảng rỗng
      if (count && offset >= count) {
        return res.json({
          data: [],
          meta: {
            pagination: {
              page,
              likesPerPage,
              totalPages,
              totalLikes,
              hasNext: false,
              hasPrevious: false,
            },
          },
        });
      }

      const { data, error } = await supabase
        .from("likes")
        .select("video_id")
        .eq("user_id", userId)
        .range(offset, offset + likesPerPage - 1);

      if (error) throw error;

      // Transform data thành format mong muốn
      const likedVideoIds = data?.map((item) => item.video_id) || [];

      const hasNext = count ? offset + likesPerPage < count : false;
      const hasPrevious = offset > 0;
      res.json({
        data: likedVideoIds, // Trả về trực tiếp array IDs thay vì object
        follower_id: userId, // Thêm follower_id ở level root
        meta: {
          pagination: {
            page,
            likesPerPage,
            totalPages,
            totalLikes,
            hasNext,
            hasPrevious,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new LikesController();
