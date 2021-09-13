export interface ErrorResponse {
  code: number;
  errorMsg: string;
}

export interface SuccessResponse<T> {
  data: T;
  success: boolean;
}

export interface IdAndName {
  Id: string;
  Name: string;
}
