import { SortDirections } from "../types";

export const WEBSITE_URL_PATTERN =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const PAGE_DAFAULT = 1;

export const PAGE_SIZE_DAFAULT = 10;

export const SORT_FIELD_DAFAULT = "createdAt";

export const SORT_DIRECTION_DAFAULT = SortDirections.DESC;
