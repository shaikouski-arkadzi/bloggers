import { UserDbWithId } from "../../users/types";
import { userQueryRepository } from "../../users/repositories";
import { NotFoundException } from "../../common/exceptions";
import { LoginInputDto, MeViewModel } from "../types";
import { bcryptService } from "./bcrypt.service";
import { MultipleUsersDuringLoginException } from "../exceptions";
import { jwtService } from "./jwt.service";
import { userService } from "../../users/application";
import { ObjectId } from "mongodb";

export const authService = {
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDbWithId[]> {
    const findedUsers =
      await userQueryRepository.findByLoginOrEmail(loginOrEmail);

    if (!findedUsers) {
      throw new NotFoundException();
    }

    return findedUsers;
  },
  async login(credentials: LoginInputDto): Promise<UserDbWithId> {
    const findedUsers: UserDbWithId[] = [];
    const users = await this.findByLoginOrEmail(credentials.loginOrEmail);

    if (!users) throw new NotFoundException();

    for (const user of users) {
      const isPasswordCorrect = await bcryptService.checkPassword(
        credentials.password,
        user.password,
      );

      if (isPasswordCorrect) {
        findedUsers.push(user);
      }
    }

    if (findedUsers.length > 1) {
      throw new MultipleUsersDuringLoginException(
        "Multiple users found with the same login or email",
      );
    }

    if (findedUsers.length === 0) throw new NotFoundException();

    return findedUsers[0];
  },
  async userInfo(auth: string): Promise<MeViewModel> {
    const [_, token] = auth.split(" ");

    const decoded = await jwtService.decodeToken(token);

    if (!decoded) throw new NotFoundException();

    const uuidObjectId = new ObjectId(decoded.uuid);

    const findedUser = await userService.getUserById(uuidObjectId);

    if (!findedUser) throw new NotFoundException();

    return {
      email: findedUser.email,
      login: findedUser.login,
      userId: findedUser.id,
    };
  },
};
