import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import ThemeProvider from "@/context/Theme";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth"; // auth sessonche function

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGroteskFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Overflow ",
  description: "A Better version of Stack Overflow in Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // yehte sessionl cha object create kela
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      {/* 1. auth.js sathi sessionProvider madhe wrap karaychi whole app chi body 
      2. 
      
      */}

      <SessionProvider session={session}>
        <body
          className={`${InterFont.variable} ${spaceGroteskFont.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

          {/* Toaster by shadcn Sooner  */}
          <Toaster />


        </body>
      </SessionProvider>
    </html>
  );
}
