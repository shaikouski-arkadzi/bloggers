import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import { UserDbWithId } from "../../users/types";
import {
  UserCommandRepository,
  UserQueryRepository,
} from "../../users/repositories";
import { UserService } from "../../users/application/user.service";
import { AuthCommandRepository } from "../repositories";
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
import { SessionModel } from "../db/session.model";

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
  ) {}

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbWithId[]> {
    const findedUsers =
      await this.userQueryRepository.findByLoginOrEmail(loginOrEmail);

    if (!findedUsers) {
      throw new NotFoundException();
    }

    return findedUsers;
  }

  async login(
    credentials: LoginInputDto,
    ip: string,
    deviceName: string,
  ): Promise<Tokens> {
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

    const userId = findedUsers[0].id;

    const deviceId = new ObjectId().toString();

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

    const session = {
      deviceId: decodedToken.deviceId,
      deviceName: decodedToken.deviceName,
      ip: decodedToken.ip,
      iat: decodedToken.iat,
      userId: decodedToken.uuid,
    };

    const sessionDoc = SessionModel.createSession(session);

    await this.authCommandRepository.save(sessionDoc);

    return { accessToken, refreshToken };
  }

  async userInfo(userId: string): Promise<MeViewModel> {
    const findedUser = await this.userService.getUserById(
      new Types.ObjectId(userId),
    );

    if (!findedUser) throw new NotFoundException();

    return {
      email: findedUser.email,
      login: findedUser.login,
      userId: findedUser.id,
    };
  }

  async resendEmail(email: string): Promise<void> {
    const userCode = await this.authCommandRepository.getUserAuthCode(email);

    if (!userCode) throw new NotFoundException();
    if (!userCode.confirmaionCode) throw new NotFoundException();

    const userModel = await this.userCommandRepository.findById(userCode._id);

    if (!userModel) throw new NotFoundException();

    userModel.updateConfirmaionCode();

    await this.userCommandRepository.save(userModel);

    nodemailerService
      .sendEmail(email, userModel.confirmaionCode!, registerTemplateMail)
      .catch((e) => console.log(e));
  }

  async confirmUser(code: string): Promise<void> {
    const user =
      await this.authCommandRepository.getUserByConfirmaionCode(code);

    if (!user) throw new NotFoundException();

    const userModel = await this.userCommandRepository.findById(user._id);

    if (!userModel) throw new NotFoundException();

    userModel.confirmUser();
    userModel.deleteConfirmaionCode();

    await this.userCommandRepository.save(userModel);
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
      const session = {
        deviceId: decodedToken.deviceId,
        deviceName: decodedToken.deviceName,
        ip: decodedToken.ip,
        iat: decodedToken.iat,
        userId: decodedToken.uuid,
      };

      const sessionDoc = SessionModel.createSession(session);

      await this.authCommandRepository.save(sessionDoc);
    }

    if (mode === "update") {
      //TODO: check

      const currentSession =
        await this.authCommandRepository.getSessionByDeviceId(
          decodedToken.deviceId,
        );

      if (!currentSession) throw new NotFoundException();

      currentSession.updateIAT(decodedToken.iat);

      await this.authCommandRepository.save(currentSession);
    }

    return { accessToken, refreshToken };
  }

  async resetPassword(email: string): Promise<void> {
    const user = await this.userCommandRepository.findByEmail(email);

    if (!user) return;

    const recoveryCode = randomUUID();
    const recoveryCodeExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();

    user.recoveryCode = recoveryCode;
    user.recoveryCodeExpiration = recoveryCodeExpiration;

    await this.userCommandRepository.save(user);

    nodemailerService
      .sendEmail(email, recoveryCode, recoveryPasswordTemplateMail)
      .catch((e) => console.log(e));
  }

  async setNewPassword(newPasswordDto: NewPasswordRecoveryDto): Promise<void> {
    const user = await this.authCommandRepository.getUserByRecoveryCode(
      newPasswordDto.recoveryCode,
    );

    if (!user) throw new NotFoundException();

    const userDb = await this.userCommandRepository.findById(user._id);

    if (!userDb) throw new NotFoundException();

    const hashPassword = await bcryptService.generateHash(
      newPasswordDto.newPassword,
    );

    userDb.password = hashPassword;
    userDb.recoveryCode = undefined;
    userDb.recoveryCodeExpiration = undefined;

    await this.userCommandRepository.save(userDb);
  }
}
