import { WithId } from "mongodb";
import { db } from "../../db";
import { UserDb } from "../types";

export const userQueryRepository = {
  async findByField(
    filter: Partial<WithId<UserDb>>,
  ): Promise<WithId<UserDb> | null> {
    const result = await db.getCollections().usersCollection.findOne(filter);

    if (!result) {
      return null;
    }

    return result;
  },
};
