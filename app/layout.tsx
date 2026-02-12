import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeInit } from "@/components/theme/theme-init";
import { LanguageProvider } from "@/components/language/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Robotic Astratech Management System",
  description: "Organizational management system for Robotic Astratech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeInit />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

