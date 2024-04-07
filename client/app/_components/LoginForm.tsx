"use client";

import { useRouter } from "next/navigation";
import login from "@/app/_api/auth/login";
import { Formik, FormikHelpers, Form, Field } from "formik";
import Link from "next/link";
import { useState } from "react";
import { useSetMessage } from "../_utils/hooks/useMessage";

export default function LoginForm() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setMessageWithDelay = useSetMessage();

  const router = useRouter();

  const handleSubmit = async (
    values: { username: string; password: string },
    { setSubmitting }: FormikHelpers<{ username: string; password: string }>
  ) => {
    try {
      const { response, cookie } = await login(values);

      if (response.statusCode != 200) {
        setError(true);

        let message = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        setErrorMessage(message);
      } else {
        setError(false);
        document.cookie = `${cookie}; SameSite=None; Secure`;
        router.push("/welcome");
        setMessageWithDelay("Logged in successfully");
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col gap-6 text-lg font-outfit">
        <h1 className="font-bold text-2xl text-center">LOGIN</h1>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="username">Username</label>
          <Field
            id="username"
            name="username"
            placeholder="John"
            className=" bg-gray-100 px-2 py-2 rounded-md text-base font-light"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            placeholder="●●●●●●●●"
            type="password"
            className=" bg-gray-100 px-2 py-2 rounded-md text-base font-light"
          />
        </div>
        {error ? (
          <div className="text-sm text-red-500">{errorMessage}</div>
        ) : (
          ""
        )}
        <button
          type="submit"
          className="bg-lightGreen rounded-md px-3 py-2 text-white"
        >
          Login
        </button>
        <Link href="/register" className="text-xs font-light  text-center">
          Don't have an account? <span className="text-blue-600">Register</span>
        </Link>
      </Form>
    </Formik>
  );
}
