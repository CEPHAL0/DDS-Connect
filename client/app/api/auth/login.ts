"use server";

import { SERVER_URL } from "@/app/_utils/config";

async function login(
  formData: any
): Promise<{ response: any; cookie: string }> {
  const jsonFormData = JSON.stringify(formData);

  const res = await fetch(`${SERVER_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonFormData,
    credentials: "include",
  });

  const response = await res.json();
  const cookie = res.headers.get("set-cookie") || "";

  return { response, cookie };
}

export default login;
