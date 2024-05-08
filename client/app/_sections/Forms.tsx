import { fetchForms } from "../_utils/helpers/fetchers";
import Form from "../_components/SurveyForm/SurveyForm";
import { ApiResponse, Form as FormType } from "../_utils/types";
import Link from "next/link";

export default async function Forms() {
  const res = await fetchForms();
  const response: ApiResponse<FormType[]> = await res.json();

  const forms = response.data;

  return (
    <div className="flex flex-col gap-3">
      {forms.map((form: FormType) => {
        const dateWithoutT = form.created_at.split("T")[0];
        return (
          <Link href={`/forms/${form.id}`} key={form.id}>
            <Form
              name={form.name}
              description={form.description}
              created_date={dateWithoutT}
              creator={form.created_by.username}
              status={form.status}
            />
          </Link>
        );
      })}
    </div>
  );
}
