import type { ReactNode } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import { Sidebar } from './Sidebar';

interface PostLayoutProps {
  children: ReactNode;
  allPosts: Post[];
  relatedPosts?: Post[];
}

export function PostLayout({ children, allPosts, relatedPosts }: PostLayoutProps) {
  return (
    <div className="flex gap-[24px]">
      <Sidebar posts={allPosts} relatedPosts={relatedPosts} />
      <main>{children}</main>
    </div>
  );
}
