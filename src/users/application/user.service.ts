import { ObjectId } from "mongodb";
import { userQueryRepository } from "../repositories";
import { userCommandRepository } from "../repositories/user.command.repository";
import { User, UserInputDto, UsersQuery } from "../types";
import { SavingException } from "../exceptions";
import { PaginatorData } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { bcryptService } from "../../auth/application";

export const userService = {
  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await userQueryRepository.findByField({ email });
    return user ? false : true;
  },
  async isLoginAvailable(login: string): Promise<boolean> {
    const user = await userQueryRepository.findByField({ login });
    return user ? false : true;
  },
  async getUserById(id: ObjectId): Promise<User | null> {
    const user = await userQueryRepository.findByField({ _id: id });
    return user;
  },
  async create(user: UserInputDto): Promise<ObjectId> {
    const { login, email, password } = user;

    const isEmailAvailable = await userService.isEmailAvailable(email);
    if (!isEmailAvailable) throw new SavingException();

    const isLoginAvailable = await userService.isLoginAvailable(login);
    if (!isLoginAvailable) throw new SavingException();

    const hashPassword = await bcryptService.generateHash(password);

    const newUser = {
      login,
      email,
      password: hashPassword,
      createdAt: new Date().toISOString(),
    };
    const createdUserId = await userCommandRepository.create(newUser);
    return createdUserId;
  },
  async findMany(queries: UsersQuery): Promise<PaginatorData<User>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;
    const searchLoginTerm = queries.searchLoginTerm;
    const searchEmailTerm = queries.searchEmailTerm;

    const allUsersCount = await userQueryRepository.count(
      searchLoginTerm,
      searchEmailTerm,
    );

    const pagesCount = Math.ceil(allUsersCount / pageSize);

    const result = await userQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    });

    const returnData: PaginatorData<User> = {
      pagesCount,
      page,
      pageSize,
      totalCount: allUsersCount,
      items: result,
    };

    return returnData;
  },
  async delete(id: string): Promise<void> {
    const user = await userService.getUserById(new ObjectId(id));

    if (!user) throw new NotFoundException();

    await userCommandRepository.delete(id);
  },
};
