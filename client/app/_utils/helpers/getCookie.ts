import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function getCookie(cookieName: string): Promise<RequestCookie> {
  const myCookies = cookies();

  const cookie = myCookies.get(cookieName);

  if (!cookie) {
    throw new Error("Failed to retrieve cookie");
  }

  return cookie;
}
