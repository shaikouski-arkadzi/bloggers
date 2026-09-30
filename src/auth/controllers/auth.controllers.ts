import { Request, Response } from "express";
import {
  LoginInputDto,
  LoginSuccessViewModel,
  MeViewModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
} from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { AuthService } from "../application/auth.service";
import {
  MultipleUsersDuringLoginException,
  RefreshTokenExistInBlackListException,
  UnauthorizedException,
} from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";
import { UserService } from "../../users/application/user.service";
import { UserInputDto } from "../../users/types";
import { SavingException } from "../../users/exceptions";

export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  loginUser = async (
    req: Request<{}, {}, LoginInputDto>,
    res: Response<LoginSuccessViewModel | APIErrorResult>,
  ) => {
    try {
      const ip = req.ip;
      const deviceName = req.get("User-Agent") ?? "Unknown device";

      if (!ip) throw new Error();

      const credentials = req.body;

      const findedUser = await this.authService.login(credentials);

      const { accessToken, refreshToken } = await this.authService.createTokens(
        findedUser.id,
        ip,
        deviceName,
      );

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
        .json({ accessToken });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof MultipleUsersDuringLoginException
      ) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  };

  userInfo = async (
    req: Request,
    res: Response<MeViewModel | APIErrorResult>,
  ) => {
    try {
      const { userId } = req.auth;

      if (!userId) throw new UnauthorizedException();

      const userInfo = await this.authService.userInfo(userId);

      return res.status(200).json(userInfo);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  };

  updateTokens = async (
    req: Request,
    res: Response<LoginSuccessViewModel | APIErrorResult>,
  ) => {
    try {
      const ip = req.ip;
      const deviceName = req.get("User-Agent") ?? "Unknown device";

      const { userId, deviceId } = req.auth;

      if (!ip || !userId || !deviceId) throw new Error();

      const { accessToken, refreshToken } = await this.authService.createTokens(
        userId,
        ip,
        deviceName,
        deviceId,
      );

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
        .json({ accessToken });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof RefreshTokenExistInBlackListException
      ) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  };

  registerUser = async (
    req: Request<{}, {}, UserInputDto>,
    res: Response<void | APIErrorResult>,
  ) => {
    const user = req.body;

    try {
      await this.userService.create(user, true);

      return res.sendStatus(204);
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

  resendRegistrationEmail = async (
    req: Request<{}, {}, RegistrationEmailResending>,
    res: Response<void | APIErrorResult>,
  ) => {
    const { email } = req.body;

    try {
      await this.authService.resendEmail(email);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(400).json({
          errorsMessages: [
            {
              message: "Ошибка при переотправке сообщения",
              field: "email",
            },
          ],
        });
      }

      return res.sendStatus(500);
    }
  };

  confirmRegistration = async (
    req: Request<{}, {}, RegistrationConfirmationCodeModel>,
    res: Response<void | APIErrorResult>,
  ) => {
    const { code } = req.body;

    try {
      await this.authService.confirmUser(code);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(400).json({
          errorsMessages: [
            {
              message: "Invalid confirmation code",
              field: "code",
            },
          ],
        });
      }

      return res.sendStatus(500);
    }
  };

  logout = async (req: Request, res: Response<void | APIErrorResult>) => {
    try {
      const { iat, deviceId } = req.auth;

      if (!deviceId || !iat) throw new Error();

      await this.authService.logout(iat, deviceId);

      return res
        .clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS)
        .sendStatus(204);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof RefreshTokenExistInBlackListException
      ) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  };
}
