import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import CommandPalette from "@/components/CommandPalette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devbolt.dev"),
  title: {
    default: "DevBolt - Free Online Utilities",
    template: "%s | DevBolt",
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
    siteName: "DevBolt",
    title: "DevBolt - Free Online Utilities",
    description:
      "Fast, clean, free online tools for developers. No signup required.",
    url: "https://devbolt.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBolt - Free Online Utilities",
    description:
      "Fast, clean, free online tools for developers. No signup required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://devbolt.dev",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

const themeScript = `(function(){var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')})()`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DevBolt",
  url: "https://devbolt.dev",
  description:
    "Fast, clean, free online tools for developers. No signup required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <CommandPalette />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <ServiceWorkerRegistration />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
