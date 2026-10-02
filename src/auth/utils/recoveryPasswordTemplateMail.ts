export const recoveryPasswordTemplateMail = (code: string): string =>
  `<a href="https://somesite.com/password-recovery?recoveryCode=${encodeURIComponent(code)}">recover password</a>`;
