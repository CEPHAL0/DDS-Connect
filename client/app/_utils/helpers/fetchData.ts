"use server";

import { SERVER_URL } from "../config";
import { HttpMethods } from "../types";

export default async function fetchData(
  method: HttpMethods,
  urlName: string,
  formData?: any,
  extraHeaders?: HeadersInit
): Promise<Response> {
  var jsonFormData;
  if (formData) {
    jsonFormData = JSON.stringify(formData);
  }

  const options: RequestInit = {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  if (extraHeaders) {
    options.headers = { ...options.headers, ...extraHeaders };
  }

  if (method == HttpMethods.post) {
    options.method = "POST";
    options.body = jsonFormData;
  } else if (method == HttpMethods.put) {
    options.method == "PUT";
    options.body = jsonFormData;
  } else if (method == HttpMethods.patch) {
    options.method == "PUT";
    options.body = jsonFormData;
  } else if (method == HttpMethods.get) {
    options.method = "GET";
  } else if (method == HttpMethods.delete) {
    options.method = "DELETE";
  } else {
    throw new Error("Method not allowed");
  }

  const res = await fetch(`${SERVER_URL}/${urlName}`, options);

  return res;
}
