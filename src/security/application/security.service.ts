import {
  authCommandRepository,
  authQueryRepository,
} from "../../auth/repositories";
import { NotFoundException } from "../../common/exceptions";

export const securityService = {
  async deleteDevice(deviceId: string): Promise<void> {
    const sessionToDelete =
      await authQueryRepository.getSessionByDeviceId(deviceId);

    if (!sessionToDelete) throw new NotFoundException();

    await authCommandRepository.deleteSessionByDeviceId(deviceId);
  },
};
