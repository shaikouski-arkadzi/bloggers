import { db } from "../../db";
import { UserDb } from "../types";

export const userQueryRepository = {
  async findByField<K extends keyof UserDb>(filter: {
    [P in K]: UserDb[P];
  }): Promise<UserDb | null> {
    const result = await db.getCollections().usersCollection.findOne(filter);

    if (!result) {
      return null;
    }

    return result;
  },
};
