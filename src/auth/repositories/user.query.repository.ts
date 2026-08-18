import { WithId } from "mongodb";
import { db } from "../../db";
import { User, UserDb } from "../types";
import { mapUserDbToUser } from "../utils";

export const userQueryRepository = {
  async findByField(filter: Partial<WithId<UserDb>>): Promise<User | null> {
    const result = await db.getCollections().usersCollection.findOne(filter);

    if (!result) {
      return null;
    }

    return mapUserDbToUser(result);
  },
  async count(
    login?: string | null,
    email?: string | null,
  ): Promise<number> {
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
  }
};
