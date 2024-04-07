"use client";

import { MessageProvider } from "../_utils/hooks/useMessage";
import ContextMessage from "./_helper_components/ContextMessage";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <MessageProvider>
        <ContextMessage />
        {children}
      </MessageProvider>
    </section>
  );
}
