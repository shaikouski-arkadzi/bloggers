import { Request, Response } from "express";
import { RegistrationConfirmationCodeModel } from "../types";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";
import { NotFoundException } from "../../common/exceptions";

export const confirmRegistration = async (
  req: Request<{}, {}, RegistrationConfirmationCodeModel>,
  res: Response<void | APIErrorResult>,
) => {
  const { code } = req.body;

  try {
    await authService.confirmUser(code);

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
