import { ObjectId } from "mongodb";
import { PaginatorData, SortBy, SortDirection } from "../../common/types";

export interface UserInputDto {
  login: string;
  password: string;
  email: string;
}

export interface UserDb extends UserInputDto {
  _id: ObjectId;
  createdAt: string;
}

export interface User {
  id: string;
  login: boolean;
  email: string;
  createdAt: string;
}
