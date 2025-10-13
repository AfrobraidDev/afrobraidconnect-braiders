// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AfroBraid Connect",
  description: "Connect with the best braiders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Providers>{children}</Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
