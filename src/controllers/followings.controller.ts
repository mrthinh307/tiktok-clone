import supabase from "~/config/supabase";

class FollowingsController {
  async getFollowings(req: any, res: any) {
    // Lấy userId từ user đã được authenticate
    const userId = req.user?.id;

    console.log("Requesting followings for user ID:", userId);

    if (!userId) {
      console.log("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    } else {
      console.log("User ID:", userId);
    }

    const page = isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    const followingsPerPage = 15;
    const offset = (page - 1) * followingsPerPage;

    try {
      // Lấy tổng số bản ghi
      const { count } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

      const totalPages = count ? Math.ceil(count / followingsPerPage) : 0;
      const totalFollowings = count ? count : 0;

      // Nếu offset vượt quá count, trả về mảng rỗng
      if (count && offset >= count) {
        return res.json({
          data: [],
          meta: {
            pagination: {
              page,
              followingsPerPage,
              totalPages,
              totalFollowings,
              hasNext: false,
              hasPrevious: false,
            },
          },
        });
      } // Truy vấn lấy danh sách người dùng theo dõi
      const { data, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", userId)
        .range(offset, offset + followingsPerPage - 1);

      if (error) throw error;

      // Transform data thành format mong muốn
      const following_ids = data?.map((item) => item.following_id) || [];

      const hasNext = count ? offset + followingsPerPage < count : false;
      const hasPrevious = offset > 0;
      res.json({
        data: following_ids, // Trả về trực tiếp array IDs thay vì object
        follower_id: userId, // Thêm follower_id ở level root
        meta: {
          pagination: {
            page,
            followingsPerPage,
            totalPages,
            totalFollowings,
            hasNext,
            hasPrevious,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching followings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new FollowingsController();
