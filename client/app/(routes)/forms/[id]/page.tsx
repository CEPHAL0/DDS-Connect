import { fetchForm } from "@/app/_utils/helpers/fetchers";
import { Question } from "@/app/_utils/types";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const formResponse = await fetchForm(params.id);
  if (formResponse.statusCode == 404) {
    notFound();
  }
  const form = formResponse.data;
  const questions: Question[] = form.questions;

  return (
    <div className="flex flex-col items-start justify-around gap-4 p-4">
      <p className="text-lg font-semibold">Form ID: {form.id}</p>
      <p className="text-3xl font-bold">{form.name}</p>
      <p className="text-base">{form.description}</p>
      <div>
        <p className="font-black text-lg">Questions </p>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 flex flex-col gap-2">
              <p className="text-xl font-semibold">
                {index + 1}. {question.name}
              </p>

              {question.type == "Multiple" ? (
                <div className="flex flex-col gap-3">
                  {question.values.map((value) => (
                    <div className="flex gap-2" key={value.id}>
                      <input type="checkbox" name="value" className="w-5" />
                      <label htmlFor="">{value.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {question.type == "Single" && question.values.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {question.values.map((value) => (
                        <div className="flex gap-3" key={value.id}>
                          <input type="radio" name="value" className="w-5" />
                          <label htmlFor="">{value.name}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        className="border border-gray-200 rounded-md p-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
