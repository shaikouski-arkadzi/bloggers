export interface LoginInputDto {
  loginOrEmail: string;
  password: string;
}

export interface LoginSuccessViewModel {
  accessToken: string;
}
