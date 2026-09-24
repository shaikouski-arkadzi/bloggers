import {
  authCommandRepository,
  authQueryRepository,
} from "../../auth/repositories";
import {
  NotFoundException,
  PermissionException,
} from "../../common/exceptions";

export const securityService = {
  async deleteDevice(userId: string, deviceId: string): Promise<void> {
    const sessionToDelete =
      await authQueryRepository.getSessionByDeviceId(deviceId);

    if (!sessionToDelete) throw new NotFoundException();

    if (sessionToDelete.userId !== userId) throw new PermissionException();

    await authCommandRepository.deleteSessionByDeviceId(deviceId);
  },
  async deleteDevicesExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const userSessions = await authQueryRepository.getSessionsByUserId(userId);

    if (!userSessions) throw new NotFoundException();

    const sessionsForDelete = userSessions.filter(
      (session) => session.deviceId !== deviceId,
    );

    await Promise.all(
      sessionsForDelete.map((session) =>
        authCommandRepository.deleteSessionByDeviceId(session.deviceId),
      ),
    );
  },
};
