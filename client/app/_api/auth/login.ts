"use server";

import fetchData from "@/app/_utils/helpers/fetchData";
import { HttpMethods } from "@/app/_utils/types";

async function login(
  formData: any
): Promise<{ response: any; cookie: string }> {
  const res: Response = await fetchData(HttpMethods.post, "login", formData);

  const response = await res.json();
  const cookie = res.headers.get("set-cookie") || "";

  return { response, cookie };
}

export default login;
