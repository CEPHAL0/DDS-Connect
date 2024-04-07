import { useState, useEffect } from "react";
import { useMessage } from "../../_utils/hooks/useMessage";

export default function ContextMessage() {
  const [messageVisibility, setMessageVisibility] = useState(false);
  const { message, setMessage } = useMessage();

  useEffect(() => {
    if (message) {
      setMessageVisibility(true);
      const timer = setTimeout(() => {
        setMessageVisibility(false);
      }, 5000);

      return () => {
        setMessageVisibility(false);
        clearTimeout(timer);
      };
    }
  }, [message]);

  return (
    <div>
      {messageVisibility && (
        <div className="absolute top-10 right-10 text-lightGreen px-10 py-2 bg-gray-50 border-2 font-semibold border-lightGreen rounded-md animate-bounce text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
