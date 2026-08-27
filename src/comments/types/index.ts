import { ObjectId } from "mongodb";
import { SortBy, SortDirection } from "../../common/types";

export interface CommentDb {
  _id: ObjectId;
  content: string;
  createdAt: string;
  postId: ObjectId;
  commentatorInfo: CommentatorInfo;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: CommentatorInfo;
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
