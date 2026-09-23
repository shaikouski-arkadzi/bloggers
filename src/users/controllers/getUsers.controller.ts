import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { PaginatorData } from "../../common/types";
import { User, UsersQuery } from "../types";
import { userService } from "../application";

export const getUsers = async (
  req: Request<{}, {}, {}, UsersQuery>,
  res: Response<PaginatorData<User>>,
) => {
  try {
    const usersQueries = matchedData<UsersQuery>(req);

    const result = await userService.findMany(usersQueries);

    return res.status(200).json(result);
  } catch (error) {
    return res.sendStatus(500);
  }
};
