import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PostLayout } from '@/src/components/layout/PostLayout';
import { longDate } from '@/src/lib/day';
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
      <Image
        src="/lineDrawing.png"
        fill
        aria-hidden
        alt="line drawing"
        className="pointer-events-none -z-10"
      />
      <article className="w-[720px] min-w-[720px]">
        <div className="flex gap-3 items-center">
          <span>{longDate(post.date)}</span>
          <ul className="flex gap-3">
            {post.tags.map((tag) => (
              <li key={tag} className="bg-primary-bg text-primary-main px-3 py-0.5 rounded-full">
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="prose dark:prose-invert">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </PostLayout>
  );
}
