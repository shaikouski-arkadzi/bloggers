import { ObjectId } from "mongodb";
import { inject, injectable } from "inversify";
import { User, UserDb, UserInputDto, UsersQuery } from "../types";
import { SavingException } from "../exceptions";
import { PaginatorData } from "../../common/types";
import { NotFoundException } from "../../common/exceptions";
import { bcryptService, nodemailerService } from "../../auth/application";
import { mapUserDbToRegisterUser } from "../utils";
import { registerTemplateMail } from "../../auth/utils";
import { UserCommandRepository, UserQueryRepository } from "../repositories";

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

  async getUserById(id: ObjectId): Promise<User | null> {
    const user = await this.userQueryRepository.findByField({ _id: id });
    return user;
  }

  async create(
    user: UserInputDto,
    register: boolean = false,
  ): Promise<ObjectId> {
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
    };

    if (register) {
      newUser = mapUserDbToRegisterUser(newUser);

      nodemailerService
        .sendEmail(email, newUser.confirmaionCode!, registerTemplateMail)
        .catch((e) => console.log(e));
    }

    const createdUserId = await this.userCommandRepository.create(newUser);

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
    const user = await this.getUserById(new ObjectId(id));

    if (!user) throw new NotFoundException();

    await this.userCommandRepository.delete(id);
  }
}
