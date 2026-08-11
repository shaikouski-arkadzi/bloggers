import { query } from "express-validator";

export const searchNameTermValidation = query("searchNameTerm").default(null);
