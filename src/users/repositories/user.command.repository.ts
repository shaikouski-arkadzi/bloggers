import { Types } from "mongoose";
import { injectable } from "inversify";
import { UserDocument, UserModel } from "../db/user.model";
import { UserDb } from "../types";

@injectable()
export class UserCommandRepository {
  async save(user: UserDocument): Promise<string> {
    const result = await user.save();

    return result._id.toString();
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findById(id: Types.ObjectId | string): Promise<UserDocument | null> {
    const result = await UserModel.findById(id);

    if (!result) {
      return null;
    }

    return result;
  }

  async findByEmail(email: UserDb["email"]): Promise<UserDocument | null> {
    const result = await UserModel.findOne({ email });

    if (!result) {
      return null;
    }

    return result;
  }
}
