import AddQuestionsToForm from "@/app/_components/SurveyForm/AddQuestionsToForm";
import { fetchForm } from "@/app/_utils/helpers/fetchers";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: number } }) {
  const response = await fetchForm(params.id);
  if (response.statusCode == 404) {
    notFound();
  }
  return (
    <div className="p-2 min-h-screen flex flex-col justify-center">
      <h1 className="font-bold text-center text-3xl">Add Questions to Form</h1>
      <AddQuestionsToForm formId={params.id} />
    </div>
  );
}
