export interface IResponseDetail<T> {
  meta: {
    status: number;
    message: string;
  };
  data: T;
}

export interface IResponseCollection<T> {
  meta: {
    status: number;
    message: string;
  };
  data: {
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    hasMore: boolean;
    totalDocs: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    docs: T[];
  };
}
