import Form from "@/app/_components/Form";
import Forms from "@/app/_sections/Forms";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="m-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Forms />
      </Suspense>
    </div>
  );
}
