import { UserDb } from "../../users/types";
import { userQueryRepository } from "../../users/repositories";
import { NotFoundException } from "../../common/exceptions";
import { LoginInputDto } from "../types";
import { bcryptService } from "./bcrypt.service";

export const authService = {
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDb[]> {
    const findedUsers =
      await userQueryRepository.findByLoginOrEmail(loginOrEmail);

    if (!findedUsers) {
      throw new NotFoundException();
    }

    return findedUsers;
  },
  async login(credentials: LoginInputDto): Promise<boolean> {
    const users = await this.findByLoginOrEmail(credentials.loginOrEmail);

    for (const user of users) {
      const isPasswordCorrect = await bcryptService.checkPassword(
        credentials.password,
        user.password,
      );

      if (isPasswordCorrect) {
        return true;
      }
    }

    return false;
  },
};
