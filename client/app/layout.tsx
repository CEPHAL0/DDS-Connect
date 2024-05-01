import type { Metadata } from "next";
import "./globals.css";
import { MessageProvider } from "./_utils/hooks/useMessage";
import ContextMessage from "./_components/ContextMessage";
import { Libre_Franklin } from "next/font/google";
import { cabin, satisfy, outfit } from "./_utils/fonts";

export const metadata: Metadata = {
  title: "DDS Connect",
  description: "Fill Surveys with ease using the DDS Connect App",
};

const libfrnk = Libre_Franklin({ weight: "variable", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${libfrnk.className}`}>
      <body>
        <MessageProvider>
          <ContextMessage />
          {children}
        </MessageProvider>
      </body>
    </html>
  );
}
