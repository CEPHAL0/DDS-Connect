"use client";
import { useMessage } from "@/app/_utils/hooks/useMessage";
import { useRouter } from "next/navigation";
import { useSetMessage } from "../../_utils/hooks/useSetMessage";
export default function Welcome() {
  const setMessageWithDelay = useSetMessage();

  const handleClick = () => {
    setMessageWithDelay("Button Clicked");
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
