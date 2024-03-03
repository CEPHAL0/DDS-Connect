export type ApiReponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
  statusCode: number;
};
