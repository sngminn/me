import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/src/lib/obsidian/post';
import { longDate } from '@/src/lib/utils/day';

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

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-[700px] m-auto">
      <div className="flex flex-col gap-3">
        <ul className="flex gap-3">
          {post.tags.map((tag) => (
            <li key={tag} className="bg-primary-bg text-primary-main px-3 py-0.5 rounded-full">
              <span>{tag}</span>
            </li>
          ))}
        </ul>
        <span className="ml-2">{longDate(post.date)}</span>
      </div>
      <div className="prose dark:prose-invert w-full mt-32">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
