"use client";
import { fetchForm } from "@/app/_utils/helpers/fetchers";
import { postMultipleQuestionsToForm } from "@/app/_utils/helpers/posters";
import { useSetMessage } from "@/app/_utils/hooks/useMessage";
import { Field, FieldArray, Form, Formik } from "formik";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

type question = {
  name: string;
  type: "Single" | "Multiple" | "YesNo";
  values: Array<string>;
};

type initialValues = {
  questions: Array<question>;
};

var initialValues: initialValues = {
  questions: [
    {
      name: "",
      type: "Single",
      values: [],
    },
  ],
};

function Values({ questionIndex }: { questionIndex: number }) {
  const [myValuesCount, setMyValuesCount] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <FieldArray name="values">
        {({ insert, remove, push }) => (
          <div className="flex flex-col gap-2">
            {/* {<p className="font-semibold text-sm">Values</p>} */}
            {[...Array(myValuesCount)].map((value, indexValue) => (
              <div className="flex gap-3" key={indexValue}>
                <p className="flex flex-col justify-end">{indexValue + 1}.</p>
                <Field
                  name={`questions.${questionIndex}.values.${indexValue}`}
                  className="border-b ring-0 border-b-gray-500 p-2 rounded-sm text-sm focus:ring-0 focus:border-b-0 "
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setMyValuesCount((prev) => prev + 1);
              }}
              className="bg-darkGreen w-fit rounded-md p-2 text-xs text-white"
            >
              Add Values
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}

export default function AddQuestionsToForm({ formId }: { formId: number }) {
  const router = useRouter();

  const [questionsCount, setQuestionsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const setMessageWithDelay = useSetMessage();
  const [questionType, setQuestionType] = useState<"Single" | "Multiple">(
    "Single"
  );

  async function handleSubmit(formData: any) {
    setSubmitting((prev) => true);
    const response = await postMultipleQuestionsToForm(
      formData.questions,
      formId
    );
    if (response.statusCode == 200) {
      setMessageWithDelay(response.message);
      router.push("/forms");
      router.refresh();
    }
    setSubmitting(false);
  }

  return (
    <div className="m-4">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ errors, touched, isValidating }) => (
          <Form className="flex flex-col w-[60vw] mx-auto">
            <FieldArray name="questions">
              {({ insert, remove, push }) => (
                <div className="flex flex-col gap-5">
                  {[...Array(questionsCount)].map((question, indexQuestion) => (
                    <div
                      className="flex flex-col gap-6 bg-slate-100 p-8  rounded-md"
                      key={indexQuestion}
                    >
                      <div className="flex flex-col">
                        <Field
                          name={`questions.${indexQuestion}.name`}
                          className={`border  px-3 py-2 ${
                            errors.questions ? "border-red-400" : ""
                          }`}
                          placeholder="Question"
                          validate={(value: any) => {
                            if (value == "") {
                              return "Cannot be empty";
                            }
                          }}
                        />
                      </div>

                      <div className="flex flex-col">
                        <Field
                          name={`questions.${indexQuestion}.type`}
                          className={`border  px-3 py-2 ${
                            errors.questions ? "border-red-400" : ""
                          }`}
                          validate={(value: any) => {
                            if (value == "") {
                              return "Cannot be empty";
                            }
                          }}
                          disabled
                        />
                      </div>

                      <Values questionIndex={indexQuestion} />

                      <button
                        onClick={() => {
                          setQuestionsCount((prev) => prev - 1);
                          remove(indexQuestion);
                        }}
                        className="px-2 py-1 bg-red-500 text-white text-sm rounded-md w-fit"
                      >
                        Remove Question
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-3 justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionsCount((prev) => prev + 1);
                        push({ name: "", type: "Single", values: [] });
                      }}
                      className="px-3 py-2 mb-2 bg-lightGreen rounded-md text-white w-1/2"
                    >
                      Add Single Type Question
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionsCount((prev) => prev + 1);
                        push({ name: "", type: "Multiple", values: [""] });
                      }}
                      className="px-3 py-2 mb-2 bg-darkGreen border-3 grow  border-darkGreen rounded-md text-white"
                    >
                      Add Multiple Type Question
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
            {questionsCount > 0 && (
              <button
                disabled={submitting}
                type="submit"
                className={`w-fit ${
                  submitting ? "bg-gray-600" : "bg-darkGreen"
                } text-white p-3 rounded-md`}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
