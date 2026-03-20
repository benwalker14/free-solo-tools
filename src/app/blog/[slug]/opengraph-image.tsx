import { generateOgImage, ogSize, ogContentType } from "@/lib/og";
import { blogPosts, getBlogPost } from "@/data/blog-posts";

export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return generateOgImage("DevBolt Blog", "Developer guides and tutorials.");
  }

  return generateOgImage(post.title, post.description, "📝");
}
