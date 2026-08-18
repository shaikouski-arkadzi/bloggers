import { query } from "express-validator";

export const searchLoginTermValidation = query("searchLoginTerm").default(null);

export const searchEmailTermValidation = query("searchEmailTerm").default(null);

export const searchTermValidation = [
  searchLoginTermValidation,
  searchEmailTermValidation,
];
