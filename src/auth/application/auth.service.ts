import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { UserDbWithId } from "../../users/types";
import {
  userCommandRepository,
  userQueryRepository,
} from "../../users/repositories";
import { NotFoundException } from "../../common/exceptions";
import { LoginInputDto, MeViewModel } from "../types";
import { bcryptService } from "./bcrypt.service";
import {
  MultipleUsersDuringLoginException,
  RefreshTokenExistInBlackListException,
} from "../exceptions";
import { userService } from "../../users/application";
import { authQueryRepository } from "../repositories";
import { nodemailerService } from "./nodemailer.service";
import { registerTemplateMail } from "../utils";
import { updateTokens } from "../controllers";
import { authCommandRepository } from "../repositories/auth.command.repository";

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
  async userInfo(userId: string): Promise<MeViewModel> {
    const findedUser = await userService.getUserById(new ObjectId(userId));

    if (!findedUser) throw new NotFoundException();

    return {
      email: findedUser.email,
      login: findedUser.login,
      userId: findedUser.id,
    };
  },
  async resendEmail(email: string): Promise<void> {
    const userCode = await authQueryRepository.getUserAuthCode(email);

    if (!userCode) throw new NotFoundException();
    if (!userCode.confirmaionCode) throw new NotFoundException();

    const newCode = randomUUID();

    await userCommandRepository.update(userCode.id, {
      confirmaionCode: newCode,
      confirmationCodeExpiration: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    nodemailerService
      .sendEmail(email, newCode, registerTemplateMail)
      .catch((e) => console.log(e));
  },
  async confirmUser(code: string): Promise<void> {
    const user = await authQueryRepository.getUserByCode(code);

    if (!user) throw new NotFoundException();

    await userCommandRepository.update(user.id, {
      isConfirmed: true,
      confirmaionCode: undefined,
      confirmationCodeExpiration: undefined,
    });
  },
  async updateTokens(userId: string, refreshToken: string): Promise<void> {
    const findedUser = await userService.getUserById(new ObjectId(userId));

    if (!findedUser) throw new NotFoundException();

    const oldRefreshToken =
      await authQueryRepository.getRefreshTokenModel(refreshToken);

    if (oldRefreshToken) throw new RefreshTokenExistInBlackListException();

    await authCommandRepository.create({ refreshToken });
  },
};
