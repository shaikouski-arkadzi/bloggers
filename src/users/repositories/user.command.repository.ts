import { Types } from "mongoose";
import { injectable } from "inversify";
import { UserModel } from "../db/user.model";
import { UserDb } from "../types";

@injectable()
export class UserCommandRepository {
  async save(user: any): Promise<string> {
    const result = await user.save();

    return result._id.toString();
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findById(id: Types.ObjectId | string): Promise<UserDb | null> {
    const result = await UserModel.findById(id);

    if (!result) {
      return null;
    }

    return result;
  }
}
