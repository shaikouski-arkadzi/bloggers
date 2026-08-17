export interface UserInputDto {
  login: string;
  password: string;
  email: string;
}

export interface UserDb extends UserInputDto {
  createdAt: string;
}

export interface User {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
