import { ObjectId, WithId } from "mongodb";
import { userQueryRepository } from "../repositories";
import { userCommandRepository } from "../repositories/user.command.repository";
import { UserDb, UserInputDto } from "../types";

export const userService = {
  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await userQueryRepository.findByField({ email });
    return user ? false : true;
  },
  async isLoginAvailable(login: string): Promise<boolean> {
    const user = await userQueryRepository.findByField({ login });
    return user ? false : true;
  },
  async getUserById(id: ObjectId): Promise<WithId<UserDb> | null> {
    const user = await userQueryRepository.findByField({ _id: id });
    return user;
  },
  async create(user: UserInputDto): Promise<WithId<UserDb> | null> {
    const newUser = {
      ...user,
      createdAt: new Date().toISOString(),
    };
    const createdUserId = await userCommandRepository.create(newUser);
    const createdUser = await userService.getUserById(createdUserId);
    return createdUser;
  },
};
