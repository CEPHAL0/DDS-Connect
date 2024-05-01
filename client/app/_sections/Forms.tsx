import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import fetchData from "../_utils/helpers/fetchers";
import { getCookie } from "../_utils/helpers/getCookie";
import Form from "../_components/SurveyForm/SurveyForm";

export default async function Forms() {
  const jwtCookie: RequestCookie = await getCookie("jwt");
  const cookieHeader: HeadersInit = {
    Cookie: `jwt-${jwtCookie.value}`,
  };

  const res = await fetchData("GET", "forms", undefined, cookieHeader);

  const response: any = await res.json();

  const forms = response.data;

  return (
    <div className="flex flex-col gap-3">
      {forms.map((form: any) => {
        const dateWithoutT = form.created_at.split("T")[0];
        return (
          <Form
            key={form.id}
            name={form.name}
            description={form.description ?? null}
            created_date={dateWithoutT}
            creator={form.created_by.username}
            status={form.status}
          />
        );
      })}
    </div>
  );
}
