import { useState } from "react";
import { useMessage } from "@/app/_utils/hooks/useMessage";

export const useSetMessage = () => {
  const { message, setMessage } = useMessage();

  const setMessageWithDelay = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage((prev) => "");
    }, 3000);
  };

  return setMessageWithDelay;
};
