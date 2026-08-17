import { Request, Response } from "express";
import { User, UserInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { bcryptService, userService } from "../application";
import { mapUserDbToUser } from "../utils";

export const createUser = async (
  req: Request<{}, {}, UserInputDto>,
  res: Response<User | APIErrorResult>,
) => {
  const { login, email, password } = req.body;

  const isEmailAvailable = await userService.isEmailAvailable(email);
  if (!isEmailAvailable) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: "Произошла ошибка при сохранении пользователя",
          field: "data",
        },
      ],
    });
  }

  const isLoginAvailable = await userService.isLoginAvailable(login);
  if (!isLoginAvailable) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: "Произошла ошибка при сохранении пользователя",
          field: "data",
        },
      ],
    });
  }

  const hashPassword = await bcryptService.generateHash(password);

  const inputDbUser: UserInputDto = {
    login,
    email,
    password: hashPassword,
  };

  const createdUser = await userService.create(inputDbUser);

  if (!createdUser) {
    return res.status(400).json({
      errorsMessages: [
        {
          message: "Произошла ошибка при сохранении пользователя",
          field: "data",
        },
      ],
    });
  }

  const mappedUser = mapUserDbToUser(createdUser);

  res.status(201).json(mappedUser);
};
