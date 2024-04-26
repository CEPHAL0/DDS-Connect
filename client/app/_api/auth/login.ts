"use server";

import fetchData from "@/app/_utils/helpers/fetchData";
import { getCookie } from "@/app/_utils/helpers/getCookie";
import { HttpMethods } from "@/app/_utils/types";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

async function login(
  formData: any
): Promise<{ response: any; cookie: string }> {
  const res: Response = await fetchData(HttpMethods.post, "login", formData);

  const response = await res.json();
  const cookie = res.headers.get("set-cookie") || "";

  return { response, cookie };
}

export default login;

export async function getProfiler(): Promise<any> {
  try {
    const jwtCookie: RequestCookie = await getCookie("hello");

    const cookieHeader: HeadersInit = {
      Cookie: `jwt=${jwtCookie.value}`,
    };

    const res = await fetchData(
      HttpMethods.get,
      "admin/users/profile",
      undefined,
      cookieHeader
    );

    const response = await res.json();
    console.log(response);
  } catch (error: any) {
    return Promise.reject("Failed to retrieve cookie or fetch data");
  }
}
