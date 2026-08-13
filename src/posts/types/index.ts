import { ObjectId } from "mongodb";
import { SortBy, SortDirection } from "../../common/types";

export interface PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostDb extends PostInputDto {
  _id: ObjectId;
  blogName: string;
  createdAt: string;
}

export interface Post extends PostInputDto {
  id: string;
  blogName: string;
  createdAt: string;
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
