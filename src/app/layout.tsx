import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KBSCircuit — Engineering Learning Platform",
    template: "%s · KBSCircuit",
  },
  description:
    "KBSCircuit is a complete engineering learning platform. Buy electronic components, complete project kits, take online courses, download source code, PCB files, and documentation — all in one place.",
  keywords: [
    "Arduino", "ESP32", "STM32", "Raspberry Pi", "electronics",
    "embedded systems", "IoT", "PCB design", "learning platform",
    "engineering", "microcontrollers", "sensors",
  ],
  authors: [{ name: "KBSCircuit" }],
  openGraph: {
    title: "KBSCircuit — Engineering Learning Platform",
    description: "Learn, build, and experiment with electronics. Components, kits, courses, and resources in one ecosystem.",
    siteName: "KBSCircuit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
