import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { DeviceViewModel } from "../types";
import { securityService } from "../application";

export const deleteDevice = async (
  req: Request<{ id: string }>,
  res: Response<void | APIErrorResult>,
) => {
  const userId = req.userId;
  const deviceId = req.deviceId;
  const iat = req.iat;

  const deviceIdToDelete = req.params.id;

  if (!userId || !deviceId) throw new Error();

  try {
    await securityService.deleteDevice(deviceIdToDelete);

    return res.status(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }
    if (error instanceof Error) {
      return res.sendStatus(500);
    }
  }
};
