import { Types } from "mongoose";
import { SortBy, SortDirection } from "../../common/types";
import { LikeStatus } from "../constants";

export interface CommentInputModel {
  content: string;
}

export interface CommentDb {
  content: string;
  createdAt: string;
  postId: Types.ObjectId;
  commentatorInfo: CommentatorInfoDB;
  likesInfo: LikesInfoDB;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfoViewModel;
}

export interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface CommentatorInfoDB {
  userId: Types.ObjectId;
  userLogin: string;
}

export interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

export interface CommentsQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy<Comment>;
  sortDirection?: SortDirection;
}

export interface LikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: TLikeStatus;
}

export interface LikesInfoDB {
  likesCount: number;
  dislikesCount: number;
}

export type TLikeStatus = (typeof LikeStatus)[keyof typeof LikeStatus];

export interface LikeInputModel {
  likeStatus: TLikeStatus;
}

export interface LikeDb {
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
  like: boolean;
}

export interface LikeModel {
  userId: string;
  commentId: string;
  like: TLikeStatus;
}
