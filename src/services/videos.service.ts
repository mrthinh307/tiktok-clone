import supabase from "../config/supabase";
import FollowService from "./followings.service";

interface PaginationMeta {
  totalPages: number;
  totalVideos: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface VideoResult {
  videos: any[];
  meta: PaginationMeta;
}

class VideoService {
  private async getPaginationMeta(
    count: number,
    page: number,
    videosPerPage: number
  ): Promise<PaginationMeta> {
    const offset = (page - 1) * videosPerPage;
    return {
      totalPages: Math.ceil(count / videosPerPage),
      totalVideos: count,
      hasNext: offset + videosPerPage < count,
      hasPrevious: offset > 0,
    };
  }

  async getPaginatedVideos(page: number, videosPerPage: number): Promise<VideoResult> {
    const offset = (page - 1) * videosPerPage;

    const { count } = await supabase
      .from("video")
      .select("*", { count: "exact", head: true });

    const total = count || 0;

    if (!total || offset >= total) {
      return {
        videos: [],
        meta: await this.getPaginationMeta(total, page, videosPerPage),
      };
    }

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

    return {
      videos: data || [],
      meta: await this.getPaginationMeta(total, page, videosPerPage),
    };
  }

  async getFollowingVideos(userId: string, page: number, videosPerPage: number): Promise<VideoResult> {
    const offset = (page - 1) * videosPerPage;
    const followingIds = await FollowService.getAllFollowingIdsByUser(userId);

    if (!followingIds || followingIds.length === 0) {
      return {
        videos: [],
        meta: {
          totalPages: 0,
          totalVideos: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    const { count } = await supabase
      .from("video")
      .select("*", { count: "exact", head: true })
      .in("user_id", followingIds);

    const total = count || 0;

    if (!total || offset >= total) {
      return {
        videos: [],
        meta: await this.getPaginationMeta(total, page, videosPerPage),
      };
    }

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
      .in("user_id", followingIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + videosPerPage - 1);

    if (error) throw error;

    return {
      videos: data || [],
      meta: await this.getPaginationMeta(total, page, videosPerPage),
    };
  }
}

export default new VideoService();
