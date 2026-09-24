import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { securityService } from "../application";

export const deleteDevicesExceptCurrent = async (
  req: Request,
  res: Response<void | APIErrorResult>,
) => {
  const userId = req.userId;
  const deviceId = req.deviceId;

  if (!userId || !deviceId) throw new Error();

  try {
    await securityService.deleteDevicesExceptCurrent(userId, deviceId);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }

    return res.sendStatus(500);
  }
};
