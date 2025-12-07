import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PostLayout } from '@/src/components/layout/PostLayout';
import { getAllPosts, getPostBySlug } from '@/src/lib/obsidian/post';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();

  if (!post) {
    notFound();
  }

  return (
    <PostLayout allPosts={allPosts}>
      <article className="prose dark:prose-invert w-[720px]">
        <span>{String(post.date)}</span>
        <MDXRemote source={post.content} />
      </article>
    </PostLayout>
  );
}
