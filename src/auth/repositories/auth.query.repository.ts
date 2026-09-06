import { db } from "../../db";
import { mapUserDbToAuth } from "../utils/mapUserDbToAuth";
import { IAuthCode } from "../types";

export const authQueryRepository = {
  async getUserAuthCode(email: string): Promise<IAuthCode | null> {
    const result = await db.getCollections().usersCollection.findOne({ email });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  },
};
