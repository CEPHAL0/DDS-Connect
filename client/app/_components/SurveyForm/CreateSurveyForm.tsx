"use client";

import { postForm } from "@/app/_utils/helpers/posters";
import { useSetMessage } from "@/app/_utils/hooks/useMessage";
import { Field, Form, Formik } from "formik";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { useState } from "react";

function validateName(value: string) {
  let error;
  if (value == "") {
    error = "Required";
  }
  return error;
}

export default function CreateSurveyForm() {
  const [loading, setLoading] = useState(false);
  const setMessageWithDelay = useSetMessage();
  const router = useRouter();

  async function handleSubmit(values: { name: string; description: string }) {
    setLoading(true);
    const response = await postForm(values);

    if (response.statusCode != 200) {
      setMessageWithDelay("Failed to create form");
      setLoading(false);
      router.refresh();
    } else {
      setLoading(false);
      router.push(`create/questions/${response.data.id}`);
      setMessageWithDelay("Form Created Successfully");
    }
  }

  return (
    <Formik
      initialValues={{ name: "", description: "" }}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isValidating }) => (
        <Form className="p-4 flex flex-col gap-4 w-[60vw]">
          <h1 className="font-bold text-xl">Create Form</h1>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <label htmlFor="">Name</label>
              {errors.name && touched.name && (
                <div className="text-red-500 text-xs">{errors.name}</div>
              )}
            </div>
            <Field
              id="name"
              name="name"
              placeholder="My Form"
              className={` border p-4 rounded-md ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
              validate={validateName}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Description</label>
            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Description"
              className=" border border-gray-600 p-4 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md px-3 py-3 text-white w-fit ${
              loading ? "bg-gray-600" : "bg-lightGreen"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
