import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://free-solo-tools.vercel.app"),
  title: {
    default: "FreeSolo Tools - Free Online Utilities",
    template: "%s | FreeSolo Tools",
  },
  description:
    "Fast, clean, free online tools. JSON formatter, Base64 encoder, hash generator, UUID generator, color converter, and more. No signup required.",
  keywords: [
    "online tools",
    "JSON formatter",
    "Base64 encoder",
    "hash generator",
    "UUID generator",
    "color converter",
    "free tools",
    "developer tools",
  ],
  openGraph: {
    type: "website",
    siteName: "FreeSolo Tools",
    title: "FreeSolo Tools - Free Online Utilities",
    description:
      "Fast, clean, free online tools for developers. No signup required.",
    url: "https://free-solo-tools.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "FreeSolo Tools - Free Online Utilities",
    description:
      "Fast, clean, free online tools for developers. No signup required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://free-solo-tools.vercel.app",
  },
};

const themeScript = `(function(){var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
