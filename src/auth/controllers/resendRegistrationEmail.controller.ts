import { Request, Response } from "express";
import { RegistrationEmailResending } from "../types";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";
import { NotFoundException } from "../../common/exceptions";

export const resendRegistrationEmail = async (
  req: Request<{}, {}, RegistrationEmailResending>,
  res: Response<void | APIErrorResult>,
) => {
  const { email } = req.body;

  try {
    await authService.resendEmail(email);

    res.sendStatus(204);
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
  }
};
