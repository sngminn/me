import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Tag } from '@/src/components/ui/Tag';
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
  if (!post) notFound();

  return (
    <>
      <div className="fixed top-0 gap-3 w-full max-w-[700px] left-1/2 -translate-x-1/2 px-3 py-2 flex items-center bg-bg-default border-b border-bg-subtle z-10">
        <Tag text={post.tags[0]} />
        <span className="text-xs text-text-highlight font-medium line-clamp-1">{post.title}</span>
      </div>
      <article className="max-w-[700px] m-auto px-3 pb-40 flex flex-col gap-4 mt-14">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={`/thumbnails/thumbnail_0${(post.title.length % 8) + 1}.png`}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <Tag text={post.tags[0]} />
        <h1 className="font-semibold text-2xl leading-[125%] text-text-highlight">{post.title}</h1>
        <span className="text-xs">{longDate(post.date)}</span>
        <hr className="text-bg-subtle" />
        <div className="prose dark:prose-invert w-full mt-8">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </>
  );
}
