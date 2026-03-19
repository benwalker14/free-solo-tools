import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/og-fetch
 * Fetches a URL server-side and extracts meta tags (bypasses CORS).
 * Returns only parsed meta tag data, not the full HTML.
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "Missing required field: url" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    // Block private/internal IPs
    const hostname = parsed.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.") ||
      hostname === "::1" ||
      hostname.endsWith(".local")
    ) {
      return NextResponse.json(
        { error: "Private/internal URLs are not allowed" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "DevBolt OG Preview (https://devbolt.dev/tools/og-preview)",
          Accept: "text/html",
        },
        redirect: "follow",
      });
    } catch (err) {
      clearTimeout(timeout);
      const message =
        err instanceof Error && err.name === "AbortError"
          ? "Request timed out (10s)"
          : "Failed to fetch URL";
      return NextResponse.json({ error: message }, { status: 502 });
    }
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `URL returned HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json(
        { error: "URL does not return HTML content" },
        { status: 400 }
      );
    }

    // Limit to 512KB to prevent memory issues
    const text = await response.text();
    const html = text.slice(0, 512 * 1024);

    const tags = extractMetaTags(html);

    return NextResponse.json({
      url: response.url,
      tags,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

interface MetaTag {
  type: "meta" | "title" | "link";
  property?: string;
  name?: string;
  content?: string;
  rel?: string;
  href?: string;
}

function extractMetaTags(html: string): MetaTag[] {
  const tags: MetaTag[] = [];

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    tags.push({
      type: "title",
      content: decodeEntities(titleMatch[1].trim()),
    });
  }

  // Extract <meta> tags
  const metaRegex = /<meta\s+([^>]*?)\/?>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = match[1];
    const tag: MetaTag = { type: "meta" };

    const propMatch = attrs.match(/property\s*=\s*["']([^"']+)["']/i);
    const nameMatch = attrs.match(/name\s*=\s*["']([^"']+)["']/i);
    const contentMatch = attrs.match(/content\s*=\s*["']([^"']*?)["']/i);

    if (propMatch) tag.property = propMatch[1];
    if (nameMatch) tag.name = nameMatch[1];
    if (contentMatch) tag.content = decodeEntities(contentMatch[1]);

    if (tag.property || tag.name) {
      tags.push(tag);
    }
  }

  // Extract <link> tags (canonical, icon, etc.)
  const linkRegex = /<link\s+([^>]*?)\/?>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrs = match[1];
    const relMatch = attrs.match(/rel\s*=\s*["']([^"']+)["']/i);
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*?)["']/i);

    if (relMatch && hrefMatch) {
      const rel = relMatch[1].toLowerCase();
      if (["canonical", "icon", "shortcut icon", "apple-touch-icon"].includes(rel)) {
        tags.push({
          type: "link",
          rel,
          href: hrefMatch[1],
        });
      }
    }
  }

  return tags;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
