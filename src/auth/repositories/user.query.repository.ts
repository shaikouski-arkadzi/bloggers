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
};
