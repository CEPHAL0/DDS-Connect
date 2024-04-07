"use server";

import { SERVER_URL } from "@/app/_utils/config";
import fetchData from "@/app/_utils/helpers/fetchData";
import { HttpMethods } from "@/app/_utils/types";

async function register(formData: any): Promise<any> {
  const res: Response = await fetchData(HttpMethods.post, "register", formData);

  const response = await res.json();

  return response;
}

export default register;
