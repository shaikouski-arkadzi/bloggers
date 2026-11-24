import { Post } from "../types";
import { TLikeStatus } from "../../common/types";

export const mapPostWithMyStatus = (
  post: Post,
  myLikeStatus: TLikeStatus,
): Post => ({
  id: post.id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  createdAt: post.createdAt,
  blogId: post.blogId,
  blogName: post.blogName,
  extendedLikesInfo: {
    likesCount: post.extendedLikesInfo.likesCount,
    dislikesCount: post.extendedLikesInfo.dislikesCount,
    myStatus: myLikeStatus,
  },
});
