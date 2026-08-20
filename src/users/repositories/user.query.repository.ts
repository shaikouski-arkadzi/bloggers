import { WithId } from "mongodb";
import { db } from "../../db";
import { User, UserDb } from "../types";
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

export const userQueryRepository = {
  async find({
    page = PAGE_DAFAULT,
    pageSize = PAGE_SIZE_DAFAULT,
    sortBy = SORT_FIELD_DAFAULT,
    sortDirection = SORT_DIRECTION_DAFAULT,
    searchLoginTerm = null,
    searchEmailTerm = null,
  }: UsersQueryParams = {}): Promise<User[]> {
    const result = await db
      .getCollections()
      .usersCollection.find(
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
      .limit(pageSize)
      .toArray();

    return result.map(mapUserDbToUser);
  },
  async findByField(filter: Partial<WithId<UserDb>>): Promise<User | null> {
    const result = await db.getCollections().usersCollection.findOne(filter);

    if (!result) {
      return null;
    }

    return mapUserDbToUser(result);
  },
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

    return db.getCollections().usersCollection.countDocuments(filter);
  },
};
