export interface LoginInputDto {
  loginOrEmail: string;
  password: string;
}

export interface LoginSuccessViewModel {
  accessToken: string;
}

export interface MeViewModel {
  email: string;
  login: string;
  userId: string;
}

export interface RegistrationEmailResending {
  email: string;
}

export interface RegistrationConfirmationCodeModel {
  code: string;
}

export interface IAuthCode {
  id: string;
  confirmaionCode?: string;
}
