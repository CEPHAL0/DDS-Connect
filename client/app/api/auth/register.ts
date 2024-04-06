"use server";

import { SERVER_URL } from "@/app/_utils/config";

async function register(formData: any): Promise<any> {
  const jsonFormData = JSON.stringify(formData);

  const res = await fetch(`${SERVER_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonFormData,
    credentials: "include",
  });

  const response = await res.json();

  return response;
}

export default register;
