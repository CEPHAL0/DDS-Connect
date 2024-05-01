import Form from "@/app/_components/SurveyForm/SurveyForm";
import Forms from "@/app/_sections/Forms";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="m-4 flex flex-col gap-4">
      <Link
        href={"/forms/create"}
        className="bg-lightGreen px-2 py-1 rounded-md text-white w-fit"
      >
        Create Form
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <Forms />
      </Suspense>
    </div>
  );
}
