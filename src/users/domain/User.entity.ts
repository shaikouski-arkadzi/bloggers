import { randomUUID } from "node:crypto";
import { UserDocument, UserModel } from "../db/user.model";
import { UserInputDto } from "../types";

export class UserEntity {
  private constructor(
    public isConfirmed: boolean,
    public confirmaionCode?: string,
    public confirmationCodeExpiration?: string,
    public recoveryCode?: string,
    public recoveryCodeExpiration?: string,
  ) {}

  static createUser(
    userInput: UserInputDto,
    hashPassword: string,
  ): UserDocument {
    const user = new UserModel(userInput);

    user.password = hashPassword;
    user.createdAt = new Date().toISOString();

    return user;
  }

  static registerUser(
    userInput: UserInputDto,
    hashPassword: string,
  ): UserDocument {
    const user = new UserModel(userInput);

    user.password = hashPassword;
    user.createdAt = new Date().toISOString();
    user.confirmaionCode = randomUUID();
    user.confirmationCodeExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString(); // tomorrow
    user.isConfirmed = false;

    return user;
  }

  updateConfirmaionCode(): void {
    this.confirmaionCode = randomUUID();
    this.confirmationCodeExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
  }

  confirmUser(): void {
    this.isConfirmed = true;
  }

  deleteConfirmaionCode(): void {
    this.confirmaionCode = undefined;
    this.confirmationCodeExpiration = undefined;
  }

  updateRecoveryCode(): void {
    this.recoveryCode = randomUUID();
    this.recoveryCodeExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
  }
}
