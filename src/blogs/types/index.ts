import { ObjectId } from "mongodb";
import { SortBy, SortDirection } from "../../common/types";

export interface BlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogDb extends BlogInputDto {
  _id: ObjectId;
  isMembership: boolean;
  createdAt: string;
}

export interface Blog extends BlogInputDto {
  id: string;
  isMembership: boolean;
  createdAt: string;
}

export interface BlogsQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy<Blog>;
  sortDirection?: SortDirection;
  searchNameTerm?: string;
}
