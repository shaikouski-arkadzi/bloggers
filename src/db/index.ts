import { Blog } from "../blogs/types";

export interface DB {
  blogs: Blog[];
}

export const db: DB = {
  blogs: [],
};
