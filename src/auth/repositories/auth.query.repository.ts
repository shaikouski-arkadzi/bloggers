import { db } from "../../db";
import {
  mapRefreshTokensDBModelToRefreshTokensModel,
  mapUserDbToAuth,
} from "../utils";
import { IAuthCode, RefreshTokensCollection } from "../types";

export const authQueryRepository = {
  async getUserAuthCode(email: string): Promise<IAuthCode | null> {
    const result = await db.getCollections().usersCollection.findOne({ email });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  },
  async getUserByCode(code: string): Promise<IAuthCode | null> {
    const result = await db
      .getCollections()
      .usersCollection.findOne({ confirmaionCode: code });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  },
  async getRefreshTokenModel(
    refreshToken: string,
  ): Promise<RefreshTokensCollection | null> {
    const result = await db
      .getCollections()
      .refreshTokensCollection.findOne({ refreshToken });

    if (!result) {
      return null;
    }

    return mapRefreshTokensDBModelToRefreshTokensModel(result);
  },
};
