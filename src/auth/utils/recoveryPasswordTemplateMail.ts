export const recoveryPasswordTemplateMail = (code: string): string =>
  `<a href='https://somesite.com/password-recovery?code=${code}'>recover password</a>`;
