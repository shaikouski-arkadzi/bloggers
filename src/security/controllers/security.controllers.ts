import { Request, Response } from "express";
import { APIErrorResult } from "../../common/types";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";
import { DeviceViewModel } from "../types";
import { SecurityService } from "../application/security.service";
import { SecurityQueryRepository } from "../repositories";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityController {
  constructor(
    @inject(SecurityService)
    private securityService: SecurityService,

    @inject(SecurityQueryRepository)
    private securityQueryRepository: SecurityQueryRepository,
  ) {}

  getDevices = async (
    req: Request,
    res: Response<DeviceViewModel[] | APIErrorResult>,
  ) => {
    const { userId, deviceId } = req.auth;

    if (!userId || !deviceId) throw new Error();

    try {
      const sessions =
        await this.securityQueryRepository.getUserDevices(userId);

      if (!sessions) throw new Error();

      return res.status(200).json(sessions);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  };

  deleteDevice = async (
    req: Request<{ id: string }>,
    res: Response<void | APIErrorResult>,
  ) => {
    const { userId, deviceId } = req.auth;
    const deviceIdToDelete = req.params.id;

    if (!userId || !deviceId) throw new Error();

    try {
      await this.securityService.deleteDevice(userId, deviceIdToDelete);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(404);
      }
      if (error instanceof PermissionException) {
        return res.sendStatus(403);
      }

      return res.sendStatus(500);
    }
  };

  deleteDevicesExceptCurrent = async (
    req: Request,
    res: Response<void | APIErrorResult>,
  ) => {
    const { userId, deviceId } = req.auth;

    if (!userId || !deviceId) throw new Error();

    try {
      await this.securityService.deleteDevicesExceptCurrent(userId, deviceId);

      return res.sendStatus(204);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.sendStatus(401);
      }

      return res.sendStatus(500);
    }
  };
}
