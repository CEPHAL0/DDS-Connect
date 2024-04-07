import type { Metadata } from "next";
import "./globals.css";
import { MessageProvider } from "./_utils/hooks/useMessage";
import ContextMessage from "./_components/ContextMessage";

import { cabin, satisfy, outfit } from "./_utils/fonts";

export const metadata: Metadata = {
  title: "DDS Connect",
  description: "Fill Surveys with ease using the DDS Connect App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cabin.variable} ${satisfy.variable} ${outfit.variable}`}
    >
      <body>
        <MessageProvider>
          <ContextMessage />
          {children}
        </MessageProvider>
      </body>
    </html>
  );
}
