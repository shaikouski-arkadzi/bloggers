import { Types } from "mongoose";
import {
  LikesInfoDB,
  LikesInfoViewModel,
  SortBy,
  SortDirection,
  TLikeStatus,
} from "../../common/types";

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

export interface LikeCommentDb {
  userId: Types.ObjectId;
  commentId: Types.ObjectId;
  like: boolean;
}

export interface LikeCommentModel {
  userId: string;
  commentId: string;
  like: TLikeStatus;
}
