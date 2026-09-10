import { WithId } from "mongodb";
import { RefreshTokensCollection, RefreshTokensDBCollection } from "../types";

export const mapRefreshTokensDBModelToRefreshTokensModel = (
  refreshTokenDB: WithId<RefreshTokensDBCollection>,
): RefreshTokensCollection => ({
  id: refreshTokenDB._id.toString(),
  refreshToken: refreshTokenDB.refreshToken,
});
