import supabase from "~/config/supabase";

class FollowService {
  async getFollowingsByUser(
    userId: string,
    page: number,
    followingsPerPage: number
  ) {
    const offset = (page - 1) * followingsPerPage;

    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    const totalPages = count ? Math.ceil(count / followingsPerPage) : 0;
    const totalFollowings = count || 0;

    if (count && offset >= count) {
      return {
        following_ids: [],
        follower_id: userId,
        meta: {
          totalPages,
          totalFollowings,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    const { data, error } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId)
      .range(offset, offset + followingsPerPage - 1);

    if (error) throw error;

    const following_ids = data?.map((item) => item.following_id) || [];
    const hasNext = count ? offset + followingsPerPage < count : false;
    const hasPrevious = offset > 0;

    return {
      following_ids,
      follower_id: userId,
      meta: {
        totalPages,
        totalFollowings,
        hasNext,
        hasPrevious,
      },
    };
  }

  // Lấy tất cả following_ids của user (không phân trang) - dùng cho filter video
  async getAllFollowingIdsByUser(userId: string) {
    const { data, error } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (error) throw error;

    return data?.map((item) => item.following_id) || [];
  }
}

export default new FollowService();
