import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
export const metadata = {
  title: {
    default: "LUMI Computer — Computer Parts & Laptops",
    template: "%s · LUMI Computer"
  },
  description: "LUMI Computer sells desktop computer parts and laptops — CPUs, GPUs, motherboards, memory, storage, power supplies, and complete gaming and productivity laptops.",
  keywords: ["CPU", "GPU", "graphics card", "motherboard", "RAM", "SSD", "power supply", "PC parts", "laptops", "gaming PC", "computer hardware"],
  authors: [{
    name: "LUMI Computer"
  }],
  openGraph: {
    title: "LUMI Computer — Computer Parts & Laptops",
    description: "Shop CPUs, GPUs, motherboards, memory, storage, and laptops — all in one place.",
    siteName: "LUMI Computer",
    type: "website"
  }
};
export default function RootLayout({
  children
}) {
  return <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>;
}
