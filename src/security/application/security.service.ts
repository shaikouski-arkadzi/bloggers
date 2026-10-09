import { inject, injectable } from "inversify";
import {
  AuthCommandRepository,
  AuthQueryRepository,
} from "../../auth/repositories";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";

@injectable()
export class SecurityService {
  constructor(
    @inject(AuthCommandRepository)
    private authCommandRepository: AuthCommandRepository,

    @inject(AuthQueryRepository)
    private authQueryRepository: AuthQueryRepository,
  ) {}

  async deleteDevice(userId: string, deviceId: string): Promise<void> {
    const sessionToDelete =
      await this.authQueryRepository.getSessionByDeviceId(deviceId);

    if (!sessionToDelete) throw new NotFoundException();

    if (sessionToDelete.userId !== userId) throw new PermissionException();

    await this.authCommandRepository.deleteSessionByDeviceId(deviceId);
  }

  async deleteDevicesExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const userSessions =
      await this.authQueryRepository.getSessionsByUserId(userId);

    if (!userSessions) throw new NotFoundException();

    const sessionsForDelete = userSessions.filter(
      (session) => session.deviceId !== deviceId,
    );

    await Promise.all(
      sessionsForDelete.map((session) =>
        this.authCommandRepository.deleteSessionByDeviceId(session.deviceId),
      ),
    );
  }
}
