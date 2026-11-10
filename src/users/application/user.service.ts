import { Types } from "mongoose";
import { inject, injectable } from "inversify";
import { randomUUID } from "node:crypto";
import { User, UserDb, UserInputDto, UsersQuery } from "../types";
import { SavingException } from "../exceptions";
import { PaginatorData } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { bcryptService, nodemailerService } from "../../auth/application";
import { registerTemplateMail } from "../../auth/utils";
import { UserCommandRepository, UserQueryRepository } from "../repositories";
import { UserModel } from "../db/user.model";

@injectable()
export class UserService {
  constructor(
    @inject(UserCommandRepository)
    private userCommandRepository: UserCommandRepository,

    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,
  ) {}

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userQueryRepository.findByField({ email });
    return !user;
  }

  async isLoginAvailable(login: string): Promise<boolean> {
    const user = await this.userQueryRepository.findByField({ login });
    return !user;
  }

  async getUserById(id: Types.ObjectId): Promise<User | null> {
    const user = await this.userQueryRepository.findByField({ _id: id });
    return user;
  }

  async create(user: UserInputDto): Promise<string> {
    const { login, email, password } = user;

    const isEmailAvailable = await this.isEmailAvailable(email);
    if (!isEmailAvailable) throw new SavingException();

    const isLoginAvailable = await this.isLoginAvailable(login);
    if (!isLoginAvailable) throw new SavingException();

    // CHECK
    const hashPassword = await bcryptService.generateHash(password);

    const userModel = UserModel.createUser(user, hashPassword);

    const createdUserId = await this.userCommandRepository.save(userModel);

    return createdUserId;
  }

  async register(user: UserInputDto): Promise<string> {
    const { login, email, password } = user;

    const isEmailAvailable = await this.isEmailAvailable(email);
    if (!isEmailAvailable) throw new SavingException();

    const isLoginAvailable = await this.isLoginAvailable(login);
    if (!isLoginAvailable) throw new SavingException();

    const hashPassword = await bcryptService.generateHash(password);

    let newUser: UserDb = {
      login,
      email,
      password: hashPassword,
      createdAt: new Date().toISOString(),
      confirmaionCode: randomUUID(),
      confirmationCodeExpiration: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(), // tomorrow
      isConfirmed: false,
    };

    nodemailerService
      .sendEmail(email, newUser.confirmaionCode!, registerTemplateMail)
      .catch((e) => console.log(e));

    const userModel = new UserModel(newUser);

    const createdUserId = await this.userCommandRepository.save(userModel);

    return createdUserId;
  }

  async findMany(queries: UsersQuery): Promise<PaginatorData<User>> {
    const page = Number(queries.pageNumber);
    const pageSize = Number(queries.pageSize);
    const sortBy = queries.sortBy;
    const sortDirection = queries.sortDirection;
    const searchLoginTerm = queries.searchLoginTerm;
    const searchEmailTerm = queries.searchEmailTerm;

    const allUsersCount = await this.userQueryRepository.count(
      searchLoginTerm,
      searchEmailTerm,
    );

    const pagesCount = Math.ceil(allUsersCount / pageSize);

    const result = await this.userQueryRepository.find({
      page,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    });

    return {
      pagesCount,
      page,
      pageSize,
      totalCount: allUsersCount,
      items: result,
    };
  }

  async delete(id: string): Promise<void> {
    const user = await this.getUserById(new Types.ObjectId(id));

    if (!user) throw new NotFoundException();

    await this.userCommandRepository.delete(id);
  }
}
