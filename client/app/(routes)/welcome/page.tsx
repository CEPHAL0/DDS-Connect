"use client";
import { useRouter } from "next/navigation";
import { useSetMessage } from "../../_utils/hooks/useMessage";
import { getProfiler } from "@/app/_api/auth/login";
export default function Welcome() {
  const setMessageWithDelay = useSetMessage();

  const handleClick = async () => {
    await getProfiler().catch((error) => {
      console.log(error.message);
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
