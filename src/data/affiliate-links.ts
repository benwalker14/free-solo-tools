// Affiliate links configuration
// Replace URLs with tracking URLs once affiliate accounts are set up.
// All links open in new tab with rel="noopener sponsored" for transparency.

export interface AffiliateLink {
  name: string;
  url: string;
  description: string;
}

export const affiliateLinks = {
  digitalocean: {
    name: "DigitalOcean",
    url: "https://www.digitalocean.com/",
    description: "Cloud hosting with simple pricing",
  },
  digitaloceanAppPlatform: {
    name: "DigitalOcean App Platform",
    url: "https://www.digitalocean.com/products/app-platform",
    description: "Deploy containers and apps with zero infrastructure management",
  },
  digitaloceanK8s: {
    name: "DigitalOcean Kubernetes",
    url: "https://www.digitalocean.com/products/kubernetes",
    description: "Managed Kubernetes clusters",
  },
  digitaloceanManagedDb: {
    name: "DigitalOcean Managed Databases",
    url: "https://www.digitalocean.com/products/managed-databases",
    description: "Managed PostgreSQL, MySQL, Redis, MongoDB",
  },
  netlify: {
    name: "Netlify",
    url: "https://www.netlify.com/",
    description: "Deploy frontend sites with CI/CD and edge functions",
  },
  cloudways: {
    name: "Cloudways",
    url: "https://www.cloudways.com/",
    description: "Managed cloud hosting on top of DO, AWS, GCP",
  },
} as const;
