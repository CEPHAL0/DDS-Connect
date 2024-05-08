"use server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import fetchData, { fetchForm } from "./fetchers";
import { getCookie } from "./getCookie";
import { ApiResponse, Form } from "../types";

export async function postForm(formData: any) {
  const jwtCookie: RequestCookie = await getCookie("jwt");
  const cookieHeader: HeadersInit = {
    Cookie: `jwt=${jwtCookie.value}`,
  };
  const res = await fetchData("POST", "forms/create", formData, cookieHeader);
  const response: ApiResponse<Form> = await res.json();
  return response;
}

export async function postMultipleQuestionsToForm(
  formData: any,
  formId: number
) {
  const jwtCookie: RequestCookie = await getCookie("jwt");
  const cookieHeader: HeadersInit = {
    Cookie: `jwt=${jwtCookie.value}`,
  };

  const res = await fetchData(
    "POST",
    `questions/create/form/${formId}`,
    formData,
    cookieHeader
  );
  const response: ApiResponse<Form> = await res.json();
  return response;
}
