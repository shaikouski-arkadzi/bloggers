import { UserDbWithId } from "../../users/types";
import { userQueryRepository } from "../../users/repositories";
import { NotFoundException } from "../../common/exceptions";
import { LoginInputDto } from "../types";
import { bcryptService } from "./bcrypt.service";
import { MultipleUsersDuringLoginException } from "../exceptions";

export const authService = {
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbWithId[]> {
    const findedUsers =
      await userQueryRepository.findByLoginOrEmail(loginOrEmail);

    if (!findedUsers) {
      throw new NotFoundException();
    }

    return findedUsers;
  },
  async login(credentials: LoginInputDto): Promise<UserDbWithId> {
    const findedUsers: UserDbWithId[] = [];
    const users = await this.findByLoginOrEmail(credentials.loginOrEmail);

    if (!users) throw new NotFoundException();

    for (const user of users) {
      const isPasswordCorrect = await bcryptService.checkPassword(
        credentials.password,
        user.password,
      );

      if (isPasswordCorrect) {
        findedUsers.push(user);
      }
    }

    if (findedUsers.length > 1) {
      throw new MultipleUsersDuringLoginException(
        "Multiple users found with the same login or email",
      );
    }

    if (findedUsers.length === 0) throw new NotFoundException();

    return findedUsers[0];
  },
};
