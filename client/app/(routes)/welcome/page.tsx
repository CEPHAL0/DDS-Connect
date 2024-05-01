"use client";
import { useSetMessage } from "@/app/_utils/hooks/useMessage";
export default function Welcome() {
  const setMessageWithDelay = useSetMessage();

  return (
    <div>
      <button>Click me</button>
    </div>
  );
}
