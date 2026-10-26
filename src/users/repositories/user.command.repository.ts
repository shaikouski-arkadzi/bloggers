import { injectable } from "inversify";
import { UserModel } from "../db/user.model";

@injectable()
export class UserCommandRepository {
  async save(user: any): Promise<string> {
    const result = await user.save();

    return result._id.toString();
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
