"use client";
import { Field, FieldArray, Form, Formik } from "formik";
import { useState } from "react";

const initialValues = {
  questions: [
    {
      name: "",
      type: "",
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
            {myValuesCount > 0 && (
              <p className="font-semibold text-sm">Values</p>
            )}
            {[...Array(myValuesCount)].map((value, indexValue) => (
              <div className="flex gap-3">
                <Field
                  name={`questions.${questionIndex}.values.${indexValue}`}
                  className="border-b ring-0 border-b-gray-500 p-2 rounded-sm text-sm focus:ring-0 focus:border-b-0 "
                />
                <button
                  type="button"
                  onClick={() => {
                    remove(indexValue);
                    setMyValuesCount((prev) => prev - 1);
                  }}
                  className="text-red-500"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </FieldArray>
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
  );
}

export default function Page({ params }: { params: { id: number } }) {
  const [questionsCount, setQuestionsCount] = useState(1);

  function handleSubmit(formData: any) {
    console.log(formData);
  }

  return (
    <div className="m-4">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form className="flex w-[60vw]">
          <FieldArray name="questions">
            {({ insert, remove, push }) => (
              <div className="flex flex-col gap-3">
                {[...Array(questionsCount)].map((question, indexQuestion) => (
                  <div className="flex flex-col gap-6 border border-black p-6 rounded-sm">
                    <Field
                      name={`questions.${indexQuestion}.name`}
                      className="border border-gray-400 px-3 py-2"
                      placeholder="Question"
                    />
                    <Field
                      name={`questions.${indexQuestion}.type`}
                      className="border border-gray-400 px-3 py-2"
                    />

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
                <button
                  type="button"
                  onClick={() => {
                    setQuestionsCount((prev) => prev + 1);
                    push({ name: "", type: "", values: [] });
                  }}
                  className="px-3 py-2 mb-2 bg-lightGreen rounded-md text-white"
                >
                  Add Question
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
