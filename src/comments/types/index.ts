import { ObjectId } from "mongodb";
import { SortBy, SortDirection } from "../../common/types";
import { LikeStatus } from "../constants";

export interface CommentInputModel {
  content: string;
}

export interface CommentDb {
  content: string;
  createdAt: string;
  postId: ObjectId;
  commentatorInfo: CommentatorInfoDB;
  likesInfo: LikesInfoViewModel;
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
  userId: ObjectId;
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
  myStatus: LikeStatus;
}

export type LikeStatus = (typeof LikeStatus)[keyof typeof LikeStatus];
