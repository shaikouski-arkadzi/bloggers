export const recoveryPasswordTemplateMail = (code: string): string =>
  `<a href='https://somesite.com/confirm-email?code=${code}'>recover password</a>`;
