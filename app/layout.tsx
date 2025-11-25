import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/context/Theme";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${InterFont.variable} ${spaceGroteskFont.variable} antialiased`}
      >
        <Navbar/>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
           disableTransitionOnChange
        >

         {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
