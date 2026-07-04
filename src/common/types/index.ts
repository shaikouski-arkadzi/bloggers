export interface APIErrorResult {
  errorsMessages: FieldError[];
}

export interface FieldError {
  message: string;
  field: string;
}
