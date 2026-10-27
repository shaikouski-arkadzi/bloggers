import { Types } from "mongoose";
import { injectable } from "inversify";
import { UserModel } from "../db/user.model";
import { User, UserDb, UserDbWithId } from "../types";
import { mapUserDbToUser } from "../utils";
import { SortBy, SortDirection } from "../../common/types";
import {
  PAGE_DAFAULT,
  PAGE_SIZE_DAFAULT,
  SORT_DIRECTION_DAFAULT,
  SORT_FIELD_DAFAULT,
} from "../../common/constants";

interface UsersQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy<User>;
  sortDirection?: SortDirection;
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}

@injectable()
export class UserQueryRepository {
  async find({
    page = PAGE_DAFAULT,
    pageSize = PAGE_SIZE_DAFAULT,
    sortBy = SORT_FIELD_DAFAULT,
    sortDirection = SORT_DIRECTION_DAFAULT,
    searchLoginTerm = null,
    searchEmailTerm = null,
  }: UsersQueryParams = {}): Promise<User[]> {
    const result = await UserModel.find(
      searchLoginTerm || searchEmailTerm
        ? {
            $or: [
              ...(searchLoginTerm
                ? [{ login: { $regex: searchLoginTerm, $options: "i" } }]
                : []),
              ...(searchEmailTerm
                ? [{ email: { $regex: searchEmailTerm, $options: "i" } }]
                : []),
            ],
          }
        : {},
    )
      .sort({
        [sortBy]: sortDirection === "asc" ? 1 : -1,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return result.map(mapUserDbToUser);
  }

  async findByField(
    filter: Partial<UserDb & { _id: Types.ObjectId }>,
  ): Promise<User | null> {
    const result = await UserModel.findOne(filter);

    if (!result) {
      return null;
    }

    return mapUserDbToUser(result);
  }

  async findByFieldInDb(
    filter: Partial<UserDb & { _id: Types.ObjectId }>,
  ): Promise<UserDb | null> {
    const result = await UserModel.findOne(filter);

    if (!result) {
      return null;
    }

    return result;
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbWithId[]> {
    const resultUsers = await UserModel.find({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    return resultUsers.map((user) => ({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      password: user.password,
    }));
  }

  async count(login?: string | null, email?: string | null): Promise<number> {
    const conditions = [];

    if (login) {
      conditions.push({
        login: { $regex: login, $options: "i" },
      });
    }

    if (email) {
      conditions.push({
        email: { $regex: email, $options: "i" },
      });
    }

    const filter = conditions.length > 0 ? { $or: conditions } : {};

    return UserModel.countDocuments(filter);
  }
}
