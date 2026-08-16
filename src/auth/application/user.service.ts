import { userQueryRepository } from "../repositories";

export const userService = {
  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await userQueryRepository.findByField({ email });
    return !!user;
  },
  async isLoginAvailable(login: string): Promise<boolean> {
    const user = await userQueryRepository.findByField({ login });
    return !!user;
  },
};
