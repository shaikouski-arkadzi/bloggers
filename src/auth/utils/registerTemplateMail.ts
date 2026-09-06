export const registerTemplateMail = (code: string): string =>
  `<a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>`;
