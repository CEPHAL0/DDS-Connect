import Image from "next/image";
import Person from "@/app/_assets/images/person.webp";

interface FormProps {
  name: string;
  description: string | null;
  created_date: string;
  status: "Open" | "Closed";
  creator: string;
}

export default function Form({
  name,
  description,
  created_date,
  status,
  creator,
}: FormProps) {
  return (
    <div className="border border-black-400 py-2 px-4 flex gap-2 flex-col flex-wrap">
      <div className="flex justify-between flex-wrap">
        <h1 className="text-4xl font-bold">
          {name}
          <span className="ml-2 text-[0.7rem] text-gray-500 font-normal">
            {created_date}
          </span>
        </h1>
        <div
          className={`font-semibold ${
            status == "Open" ? "text-green-600" : "text-red-600"
          }`}
        >
          ● {`${status}`}
        </div>
      </div>

      <p className="text-sm text-gray-700 ">
        Created By-<span className="font-semibold">{creator}</span>
      </p>
      <p className="text-sm md:w-4/5">
        {description ?? "No description given..."}
      </p>
    </div>
  );
}
