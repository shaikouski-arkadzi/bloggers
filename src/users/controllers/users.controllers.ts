import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { User, UserInputDto, UsersQuery } from "../types";
import { APIErrorResult, PaginatorData } from "../../common/types";
import { SavingException } from "../exceptions";
import { UserService } from "../application/user.service";
import { UserQueryRepository } from "../repositories";
import { NotFoundException } from "../../common/exceptions";

export class UsersController {
  constructor(
    private userService: UserService,
    private userQueryRepository: UserQueryRepository,
  ) {}

  createUser = async (
    req: Request<{}, {}, UserInputDto>,
    res: Response<User | APIErrorResult>,
  ) => {
    const user = req.body;

    try {
      const createdUserId = await this.userService.create(user);

      const newUser = await this.userQueryRepository.findByField({
        _id: createdUserId,
      });

      if (!newUser) throw new SavingException();

      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof SavingException) {
        return res.status(400).json({
          errorsMessages: [
            {
              message: "Произошла ошибка при сохранении пользователя",
              field: "data",
            },
          ],
        });
      }

      return res.sendStatus(500);
    }
  };

  deleteUser = async (req: Request<{ id: string }>, res: Response<null>) => {
    try {
      const { id } = req.params;

      await this.userService.delete(id);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }

      return res.sendStatus(500);
    }
  };

  getUsers = async (
    req: Request<{}, {}, {}, UsersQuery>,
    res: Response<PaginatorData<User>>,
  ) => {
    try {
      const usersQueries = matchedData<UsersQuery>(req);

      const result = await this.userService.findMany(usersQueries);

      return res.status(200).json(result);
    } catch (error) {
      return res.sendStatus(500);
    }
  };
}
