"use server";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function getCookie(cookieName: string): Promise<RequestCookie> {
  try {
    const myCookies = cookies();

    const cookie = myCookies.get(cookieName);

    if (!cookie) {
      return Promise.reject(`Failed to retrieve ${cookieName} cookie`);
    }

    return cookie;
  } catch (error) {
    return Promise.reject(`Failed to retrieve ${cookieName} cookie`);
  }
}
