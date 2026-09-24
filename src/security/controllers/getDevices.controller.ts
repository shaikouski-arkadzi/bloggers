import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { securityQueryRepository } from "../repositories";
import { DeviceViewModel } from "../types";

export const getDevices = async (
  req: Request,
  res: Response<DeviceViewModel[] | APIErrorResult>,
) => {
  const { userId, deviceId } = req.auth;

  if (!userId || !deviceId) throw new Error();

  try {
    const sessions = await securityQueryRepository.getUserDevices(userId);

    if (!sessions) throw new Error();

    return res.status(200).json(sessions);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }

    return res.sendStatus(500);
  }
};
