export type ApiReponse<T> = {
  statusCode: number;
  message: string | null;
  data: T | null;
};
