import { ObjectId } from "mongodb";

export interface PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostDb extends PostInputDto {
  _id: ObjectId;
  blogName: string;
}

export interface Post extends PostInputDto {
  id: string;
  blogName: string;
}
