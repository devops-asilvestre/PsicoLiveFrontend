export type ApiResponseDto<T> = {
  hasSuccess: boolean;
  messageFriendly: string;
  messageTechnica: string;
  payload: T;
  statusCode: number;
};

export type ApiResponsePagedDto<T> = {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasSuccess: boolean;
  messageFriendly: string;
  messageTechnica: string;
  payload: T[];
  statusCode: number;
};