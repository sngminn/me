import Image from 'next/image';
import Link from 'next/link';
import { relativeDate } from '@/src/lib/day';
import type { Post } from '@/src/lib/obsidian/types';
import { stripMarkdown } from '@/src/lib/obsidian/utils';

interface SidebarProps {
  posts: Post[];
  relatedPosts?: Post[];
  className?: string;
}

export function Sidebar({ posts, relatedPosts, className }: SidebarProps) {
  return (
    <aside className="w-[20%] min-w-[420px] fixed top-0 h-full flex flex-col p-8">
      <div className="w-full h-48 relative">
        <Image src="/logo.svg" alt="로고" fill className="object-contain object-top" />
      </div>
      <div>
        {relatedPosts && relatedPosts.length > 0 && (
          <>
            <h3>Related</h3>
            <ul>
              {relatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div>
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold text-text-bright">이런 글은 어때요?</h3>
          <hr />
        </div>
        <ul className="flex flex-col gap-4 pt-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="flex flex-col gap-1 hover:bg-bg-subtle px-4 py-2 rounded-xl"
            >
              <Link href={`/posts/${post.slug}`}>
                <h4 className="text-text-bright font-semibold text-[14px]">{post.title}</h4>
                <p className="line-clamp-2 text-[14px] text-text-subtle">
                  {stripMarkdown(post.content).substring(0, 120)}
                </p>
                <span className="text-[12px] font-medium">{relativeDate(post.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
