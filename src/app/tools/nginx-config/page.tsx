import type { Metadata } from "next";
import NginxConfigTool from "./NginxConfigTool";

export const metadata: Metadata = {
  title: "Nginx Config Generator",
  description:
    "Generate nginx configuration files with a visual builder. Configure server blocks, SSL/TLS, reverse proxy, gzip, security headers, rate limiting, and load balancing. Free online tool — no signup required.",
  keywords: [
    "nginx config generator",
    "nginx configuration builder",
    "nginx reverse proxy config",
    "nginx ssl configuration",
    "nginx server block generator",
    "nginx gzip config",
    "nginx load balancer config",
    "nginx security headers",
    "nginx conf generator online",
    "generate nginx.conf",
  ],
  alternates: {
    canonical: "/tools/nginx-config",
  },
  openGraph: {
    title: "Nginx Config Generator - DevBolt",
    description:
      "Generate nginx configuration files with a visual builder. Server blocks, SSL, reverse proxy, gzip, and more.",
    url: "/tools/nginx-config",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Nginx Config Generator",
  url: "https://devbolt.dev/tools/nginx-config",
  description:
    "Generate nginx configuration files with a visual builder. Configure server blocks, SSL/TLS, reverse proxy, gzip, security headers, rate limiting, and load balancing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function NginxConfigPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NginxConfigTool />
    </>
  );
}
