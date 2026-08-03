export interface APIErrorResult {
  errorsMessages: FieldError[];
}

export interface FieldError {
  message: string;
  field: string;
}

export const SortDirections = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortDirection =
  (typeof SortDirections)[keyof typeof SortDirections];
