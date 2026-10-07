import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { inject, injectable } from "inversify";
import { UserDbWithId } from "../../users/types";
import {
  UserCommandRepository,
  UserQueryRepository,
} from "../../users/repositories";
import { UserService } from "../../users/application/user.service";
import { AuthCommandRepository, AuthQueryRepository } from "../repositories";
import { NotFoundException } from "../../common/exceptions";
import {
  LoginInputDto,
  MeViewModel,
  NewPasswordRecoveryDto,
  Tokens,
} from "../types";
import { bcryptService } from "./bcrypt.service";
import { MultipleUsersDuringLoginException } from "../exceptions";
import { nodemailerService } from "./nodemailer.service";
import { recoveryPasswordTemplateMail, registerTemplateMail } from "../utils";
import { jwtService, TokenType } from "./jwt.service";

@injectable()
export class AuthService {
  constructor(
    @inject(UserCommandRepository)
    private userCommandRepository: UserCommandRepository,

    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,

    @inject(UserService)
    private userService: UserService,

    @inject(AuthCommandRepository)
    private authCommandRepository: AuthCommandRepository,

    @inject(AuthQueryRepository)
    private authQueryRepository: AuthQueryRepository,
  ) {}

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbWithId[]> {
    const findedUsers =
      await this.userQueryRepository.findByLoginOrEmail(loginOrEmail);

    if (!findedUsers) {
      throw new NotFoundException();
    }

    return findedUsers;
  }

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
  }

  async userInfo(userId: string): Promise<MeViewModel> {
    const findedUser = await this.userService.getUserById(new ObjectId(userId));

    if (!findedUser) throw new NotFoundException();

    return {
      email: findedUser.email,
      login: findedUser.login,
      userId: findedUser.id,
    };
  }

  async resendEmail(email: string): Promise<void> {
    const userCode = await this.authQueryRepository.getUserAuthCode(email);

    if (!userCode) throw new NotFoundException();
    if (!userCode.confirmaionCode) throw new NotFoundException();

    const newCode = randomUUID();

    await this.userCommandRepository.update(userCode.id, {
      confirmaionCode: newCode,
      confirmationCodeExpiration: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    nodemailerService
      .sendEmail(email, newCode, registerTemplateMail)
      .catch((e) => console.log(e));
  }

  async confirmUser(code: string): Promise<void> {
    const user = await this.authQueryRepository.getUserByConfirmaionCode(code);

    if (!user) throw new NotFoundException();

    await this.userCommandRepository.update(user.id, {
      isConfirmed: true,
      confirmaionCode: undefined,
      confirmationCodeExpiration: undefined,
    });
  }

  async updateTokens(): Promise<void> {}

  async logout(iat: string, deviceId: string): Promise<void> {
    await this.authCommandRepository.deleteSessionByIATAndDeviceId(
      iat,
      deviceId,
    );
  }

  async createTokens(
    userId: string,
    ip: string,
    deviceName: string,
    deviceId?: string,
  ): Promise<Tokens> {
    const mode: "create" | "update" = deviceId ? "update" : "create";

    if (mode === "create") deviceId = new ObjectId().toString();

    const accessToken = await jwtService.createToken(
      { uuid: userId },
      TokenType.Access,
    );

    const refreshToken = await jwtService.createToken(
      {
        uuid: userId,
        deviceId,
        deviceName,
        ip,
      },
      TokenType.Refresh,
    );

    const decodedToken = await jwtService.verifyToken(
      refreshToken,
      TokenType.Refresh,
    );

    if (
      !decodedToken ||
      !decodedToken.deviceId ||
      !decodedToken.deviceName ||
      !decodedToken.ip ||
      !decodedToken.uuid ||
      decodedToken.iat == null
    ) {
      throw new Error();
    }

    if (mode === "create") {
      await this.authCommandRepository.createSession({
        deviceId: decodedToken.deviceId,
        deviceName: decodedToken.deviceName,
        ip: decodedToken.ip,
        iat: decodedToken.iat,
        userId: decodedToken.uuid,
      });
    }

    if (mode === "update") {
      await this.authCommandRepository.updateSession({
        deviceId: decodedToken.deviceId,
        deviceName: decodedToken.deviceName,
        ip: decodedToken.ip,
        iat: decodedToken.iat,
        userId: decodedToken.uuid,
      });
    }

    return { accessToken, refreshToken };
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.userQueryRepository.findByField({ email });

    if (!user) return;

    const recoveryCode = randomUUID();

    await this.userCommandRepository.update(user.id, {
      recoveryCode,
      recoveryCodeExpiration: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    nodemailerService
      .sendEmail(email, recoveryCode, recoveryPasswordTemplateMail)
      .catch((e) => console.log(e));
  }

  async setNewPassword(newPasswordDto: NewPasswordRecoveryDto): Promise<void> {
    const user = await this.authQueryRepository.getUserByRecoveryCode(
      newPasswordDto.recoveryCode,
    );

    if (!user) throw new NotFoundException();

    const hashPassword = await bcryptService.generateHash(
      newPasswordDto.newPassword,
    );

    await this.userCommandRepository.update(user.id, {
      password: hashPassword,
      recoveryCode: undefined,
      recoveryCodeExpiration: undefined,
    });
  }
}
