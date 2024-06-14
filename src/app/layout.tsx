import "~/styles/globals.css";
import { Metadata } from "next";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { GlobalContextProvider } from "./_context/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "IMDA Monorepo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <GlobalContextProvider>{children}</GlobalContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
