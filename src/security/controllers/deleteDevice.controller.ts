import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";
import { securityService } from "../application";

export const deleteDevice = async (
  req: Request<{ id: string }>,
  res: Response<void | APIErrorResult>,
) => {
  const userId = req.userId;
  const deviceId = req.deviceId;

  const deviceIdToDelete = req.params.id;

  if (!userId || !deviceId) throw new Error();

  try {
    await securityService.deleteDevice(userId, deviceIdToDelete);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }
    if (error instanceof PermissionException) {
      return res.sendStatus(403);
    }
    if (error instanceof Error) {
      return res.sendStatus(500);
    }
  }
};
