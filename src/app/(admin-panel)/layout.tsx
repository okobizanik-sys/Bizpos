import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS | Bizpos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextTopLoader showSpinner={false} />
            <AdminPanelLayout>{children}</AdminPanelLayout>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
