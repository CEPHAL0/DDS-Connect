"use client";
import React, { createContext, useState, useContext } from "react";

interface MessageContextType {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState("");

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

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
