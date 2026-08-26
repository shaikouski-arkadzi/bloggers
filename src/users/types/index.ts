import { SortBy, SortDirection } from "../../common/types";

export interface UserInputDto {
  login: string;
  password: string;
  email: string;
}

export interface UserDb extends UserInputDto {
  createdAt: string;
}

export interface UserDbWithId extends UserDb {
  id: string;
}

export interface User {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export interface UsersQuery {
  pageNumber?: string;
  pageSize?: string;
  sortBy?: SortBy<User>;
  sortDirection?: SortDirection;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}
