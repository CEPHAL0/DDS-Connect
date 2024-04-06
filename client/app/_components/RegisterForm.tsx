"use client";

import { useRouter } from "next/navigation";
import login from "@/app/api/auth/login";
import { Formik, FormikHelpers, Form, Field } from "formik";
import Link from "next/link";
import register from "../api/auth/register";

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (
    values: { username: string; password: string },
    { setSubmitting }: FormikHelpers<{ username: string; password: string }>
  ) => {
    try {
      const response = await register(values);

      if (response.statusCode != 200) {
        throw new Error(response.message);
      }

      router.push("/login");
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
      <Form className="flex flex-col gap-8 text-lg font-outfit items-center">
        <h1 className="font-bold text-2xl text-center">CREATE ACCOUNT</h1>
        <div className="flex gap-6 flex-wrap justify-center">
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="username">Name</label>
            <Field
              id="name"
              name="name"
              placeholder="John Doe"
              className=" bg-gray-100 px-2 py-2 rounded-md text-base font-light"
              
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              name="username"
              placeholder="john123"
              className=" bg-gray-100 px-2 py-2 rounded-md text-base font-light"
            />
          </div>
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="username">Email</label>
            <Field
              id="email"
              name="email"
              placeholder="john@doe.com"
              className=" bg-gray-100 px-2 py-2 rounded-md text-base font-light"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              placeholder="********"
              type="password"
              className=" bg-gray-100 px-2 py-2 rounded-md text-base font-light"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-lightGreen rounded-md px-3 py-2 text-white min-w-64"
        >
          Register
        </button>
        <Link href="/login" className="text-xs font-light  text-center">
          Already have an account? <span className="text-blue-600">Login</span>
        </Link>
      </Form>
    </Formik>
  );
}
