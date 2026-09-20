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
};
