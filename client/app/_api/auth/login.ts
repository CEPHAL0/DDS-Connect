"use server";

import fetchData from "@/app/_utils/helpers/fetchers";
import { getCookie } from "@/app/_utils/helpers/getCookie";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

async function login(
  formData: any
): Promise<{ response: any; cookie: string }> {
  const res: Response = await fetchData("POST", "login", formData);

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
      "GET",
      "admin/users/profile",
      undefined,
      cookieHeader
    );

    const response = await res.json();
  } catch (error: any) {
    return Promise.reject("Failed to retrieve cookie or fetch data");
  }
}
