import { SERVER_URL } from "../config";
import { ApiResponse, Form } from "@/app/_utils/types";

export default async function fetchData(
  method: "GET" | "POST" | "PUT" | "PATCH",
  urlName: string,
  formData?: any,
  extraHeaders?: HeadersInit
): Promise<Response> {
  const options: RequestInit = {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: method,
  };

  if (formData) {
    const jsonFormData = JSON.stringify(formData);
    options.body = jsonFormData;
  }

  if (extraHeaders) {
    options.headers = { ...options.headers, ...extraHeaders };
  }

  const res = await fetch(`${SERVER_URL}/${urlName}`, options);

  return res;
}

export async function fetchForm(id: number): Promise<ApiResponse<Form>> {
  const res = await fetchData("GET", `forms/${id}`);
  if (!res.ok) {
    throw new Error("Failed to retrieve form");
  }

  const response: ApiResponse<Form> = await res.json();

  if (response.statusCode != 200) {
    throw new Error("Form not found");
  }
  return response;
}
