import Link from 'next/link';
import type { Post } from '@/src/lib/obsidian/types';

interface SidebarProps {
  posts: Post[];
  relatedPosts?: Post[];
  className?: string;
}

export function Sidebar({ posts, relatedPosts, className }: SidebarProps) {
  return (
    <aside className="w-[20%] min-w-[380px] sticky top-0 h-full">
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
        <h3>이런 글은 어때요?</h3>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
