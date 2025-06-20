import supabase from "~/config/supabase";

class UsersController {
  async followUser(req: any, res: any) {
    try {
      // Lấy user ID của người đang đăng nhập (follower)
      const followerId = req.user?.id;

      // Lấy user ID của người được follow từ URL params
      const followingId = req.params.userId;

      if (!followerId) {
        return res.status(401).json({
          error: "User not authenticated",
          message: "You must be logged in to follow users",
        });
      }

      if (!followingId) {
        return res.status(400).json({
          error: "Invalid user ID",
          message: "User ID is required",
        });
      }

      // Kiểm tra không thể follow chính mình
      if (followerId === followingId) {
        return res.status(400).json({
          error: "Cannot follow yourself",
          message: "You cannot follow your own account",
        });
      }

      // Kiểm tra user được follow có tồn tại không
      //   const { data: targetUser, error: userError } = await supabase
      //     .from("user")
      //     .select("id")
      //     .eq("id", followingId)
      //     .single();

      //   if (userError || !targetUser) {
      //     return res.status(404).json({
      //       error: "User not found",
      //       message: "The user you are trying to follow does not exist",
      //     });
      //   }

      // Kiểm tra đã follow chưa
      const { data: existingFollow, error: checkError } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingFollow) {
        return res.status(400).json({
          error: "Already following",
          message: "You are already following this user",
        });
      }

      // Tạo follow relationship
      const { data: followData, error: followError } = await supabase
        .from("follows")
        .insert({
          follower_id: followerId,
          following_id: followingId,
        })
        .select()
        .single();

      if (followError) {
        throw followError;
      }

      // Tăng follower count cho người được follow
      const { data: currentUser, error: getUserError } = await supabase
        .from("user")
        .select("followers_count")
        .eq("id", followingId)
        .single();

      if (!getUserError && currentUser) {
        const { error: updateError } = await supabase
          .from("user")
          .update({ followers_count: (currentUser.followers_count || 0) + 1 })
          .eq("id", followingId);

        if (updateError) {
          console.warn("Failed to update followers count:", updateError);
        }
      }

      // Tăng following count cho người đang follow
      const { data: currentFollower, error: getFollowerError } = await supabase
        .from("user")
        .select("followings_count")
        .eq("id", followerId)
        .single();

      if (!getFollowerError && currentFollower) {
        const { error: incrementError } = await supabase
          .from("user")
          .update({
            followings_count: (currentFollower.followings_count || 0) + 1,
          })
          .eq("id", followerId);

        if (incrementError) {
          console.warn("Failed to update followings count:", incrementError);
        }
      }

      // Trả về thành công
      res.status(201).json({
        message: "Successfully followed user",
        data: {
          follower_id: followerId,
          following_id: followingId,
          followed_at: followData.created_at,
          is_following: true,
        },
      });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "An error occurred while trying to follow the user",
      });
    }
  }

  async unfollowUser(req: any, res: any) {
    try {
      // Lấy user ID của người đang đăng nhập (follower)
      const followerId = req.user?.id;

      // Lấy user ID của người được unfollow từ URL params
      const followingId = req.params.userId;

      if (!followerId) {
        return res.status(401).json({
          error: "User not authenticated",
          message: "You must be logged in to unfollow users",
        });
      }

      if (!followingId) {
        return res.status(400).json({
          error: "Invalid user ID",
          message: "User ID is required",
        });
      }

      // Kiểm tra follow relationship có tồn tại không
      const { data: existingFollow, error: checkError } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (!existingFollow) {
        return res.status(400).json({
          error: "Not following",
          message: "You are not following this user",
        });
      }

      // Xóa follow relationship
      const { error: unfollowError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);

      if (unfollowError) {
        throw unfollowError;
      }

      // Giam follower count cho người được follow
      const { data: currentUser, error: getUserError } = await supabase
        .from("user")
        .select("followers_count")
        .eq("id", followingId)
        .single();

      if (!getUserError && currentUser) {
        const { error: updateError } = await supabase
          .from("user")
          .update({
            followers_count:
              currentUser.followers_count >= 1
                ? currentUser.followers_count - 1
                : 0,
          })
          .eq("id", followingId);

        if (updateError) {
          console.warn("Failed to update followers count:", updateError);
        }
      }

      // Decrease following count cho người đang follow
      const { data: currentFollower, error: getFollowerError } = await supabase
        .from("user")
        .select("followings_count")
        .eq("id", followerId)
        .single();

      if (!getFollowerError && currentFollower) {
        const { error: incrementError } = await supabase
          .from("user")
          .update({
            followings_count:
              currentFollower.followings_count >= 1
                ? currentFollower.followings_count - 1
                : 0,
          })
          .eq("id", followerId);

        if (incrementError) {
          console.warn("Failed to update followings count:", incrementError);
        }
      }

      // Trả về thành công
      res.status(200).json({
        message: "Successfully unfollowed user",
        data: {
          follower_id: followerId,
          following_id: followingId,
          is_following: false,
        },
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "An error occurred while trying to unfollow the user",
      });
    }
  }

  async likeVideo(req: any, res: any) {
    try {
      // Lấy user ID của người đang đăng nhập (follower)
      const userId = req.user?.id;

      // Lấy user ID của video từ URL params
      const videoId = req.params.videoId;

      if (!userId) {
        return res.status(401).json({
          error: "User not authenticated",
          message: "You must be logged in to follow users",
        });
      }

      if (!videoId) {
        return res.status(400).json({
          error: "Invalid video ID",
          message: "Video ID is required",
        });
      }

      // Kiểm tra video được like có tồn tại không
      const { data: targetVideo, error: videoError } = await supabase
        .from("video")
        .select("id")
        .eq("id", videoId)
        .single();

      if (videoError || !targetVideo) {
        return res.status(404).json({
          error: "Video not found",
          message: "The video you are trying to like does not exist",
        });
      }

      // Kiểm tra đã like chưa
      const { data: existingLike, error: checkError } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", userId)
        .eq("video_id", videoId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingLike) {
        return res.status(400).json({
          error: "Already liked",
          message: "You are already tym this video",
        });
      }

      // Tạo like relationship
      const { error: likeError } = await supabase
        .from("likes")
        .insert({
          user_id: userId,
          video_id: videoId,
        })
        .select()
        .single();

      if (likeError) {
        throw likeError;
      }

      // Tăng like count cho video được like
      const { data: videoData, error: getVideoError } = await supabase
        .from("video")
        .select("likes_count")
        .eq("id", videoId)
        .single();

      if (!getVideoError && videoData) {
        const { error: updateError } = await supabase
          .from("video")
          .update({ likes_count: (videoData.likes_count || 0) + 1 })
          .eq("id", videoId);

        if (updateError) {
          console.warn("Failed to update likes count:", updateError);
        }
      }

      // Trả về thành công
      res.status(201).json({
        message: "Successfully followed user",
        data: {
          user_id: userId,
          video_id: videoId,
        },
      });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "An error occurred while trying to follow the user",
      });
    }
  }

  async cancelLikeVideo(req: any, res: any) {
    try {
      // Lấy user ID của người đang đăng nhập (follower)
      const userId = req.user?.id;

      // Lấy user ID của video từ URL params
      const videoId = req.params.videoId;

      if (!userId) {
        return res.status(401).json({
          error: "User not authenticated",
          message: "You must be logged in to cancel like",
        });
      }

      if (!videoId) {
        return res.status(400).json({
          error: "Invalid video ID",
          message: "Video ID is required",
        });
      }

      // Kiểm tra like relationship có tồn tại không
      const { data: existingLike, error: checkError } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", userId)
        .eq("video_id", videoId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (!existingLike) {
        return res.status(400).json({
          error: "Not liked",
          message: "You have not liked this video yet",
        });
      }

      // Xóa like relationship
      const { error: unlikeError } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("video_id", videoId);

      if (unlikeError) {
        throw unlikeError;
      }

      // Giảm like count cho video được like
      const { data: videoData, error: getVideoError } = await supabase
        .from("video")
        .select("likes_count")
        .eq("id", videoId)
        .single();

      if (!getVideoError && videoData) {
        const { error: updateError } = await supabase
          .from("video")
          .update({
            likes_count:
              videoData.likes_count >= 1 ? videoData.likes_count - 1 : 0,
          })
          .eq("id", videoId);

        if (updateError) {
          console.warn("Failed to update likes count:", updateError);
        }
      }

      // Trả về thành công
      res.status(200).json({
        message: "Successfully cancelled like on video",
        data: {
          user_id: userId,
          video_id: videoId,
        },
      });
    } catch (error) {
      console.error("Error cancelling like on video:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "An error occurred while trying to cancel like on the video",
      });
    }
  }
}

export default new UsersController();
