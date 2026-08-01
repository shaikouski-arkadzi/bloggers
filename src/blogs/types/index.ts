import { ObjectId } from "mongodb";

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

export interface PaginatorBlog {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Blog[];
}
