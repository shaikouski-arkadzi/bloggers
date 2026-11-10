import { UserDocument, UserModel } from "../db/user.model";
import { UserInputDto } from "../types";

export class UserEntity {
  static createUser(
    userInput: UserInputDto,
    hashPassword: string,
  ): UserDocument {
    const user = new UserModel(userInput);

    user.password = hashPassword;
    user.createdAt = new Date().toISOString();

    return user;
  }
}
