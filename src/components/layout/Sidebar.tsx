import Link from 'next/link';
import type { Post } from '@/src/lib/obsidian/types';
import { stripMarkdown } from '@/src/lib/obsidian/utils';
import { relativeDate } from '@/src/lib/utils/day';

interface SidebarProps {
  posts: Post[];
  className?: string;
}

export function Sidebar({ posts }: SidebarProps) {
  return (
    <aside className="max-w-[720px] h-full min-h-screen flex flex-col bg-bg-default rounded-3xl ">
      <div>
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold text-text-bright">전체 글</h3>
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
