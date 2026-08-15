import bcrypt from "bcrypt";
import { SALT_ROUND_COUNTS } from "../../settings/config";

export const bcryptService = {
  async generateHash(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUND_COUNTS);
    return bcrypt.hash(password, salt);
  },

  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
};
