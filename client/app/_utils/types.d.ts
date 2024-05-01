export type ApiResponse<T> = {
  data: T;
  statusCode: number;
  message: string;
};

type User = {
  id: number;
  username: string;
  name: string;
  role: "admin" | "user" | "member";
  email: string;
  password?: string;
};

type Form = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  status: "Open" | "Closed";
  questions: Array<Question>;
  created_by: User;
};

type Question = {
  id: number;
  name: string;
  type: "Single" | "Multiple" | "Date" | "YesNo";
  created_at: string;
  updated_at: string;
  values: Array<Value>;
};

type Value = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};
