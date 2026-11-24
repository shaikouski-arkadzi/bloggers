import { Types } from "mongoose";
import {
  LikesInfoViewModel,
  SortBy,
  SortDirection,
  TLikeStatus,
} from "../../common/types";

export interface PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostDb extends PostInputDto {
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikesInfoViewModel;
}

export interface Post extends PostInputDto {
  id: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikesInfoViewModel;
}

export interface PostsQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy<Post>;
  sortDirection?: SortDirection;
}

export interface UpdatedPost extends PostInputDto {
  blogName: string;
}

export interface LikePostDb {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  like: boolean;
  createdAt: string;
}

export interface LikeCommentModel {
  userId: string;
  postId: string;
  like: TLikeStatus;
}
