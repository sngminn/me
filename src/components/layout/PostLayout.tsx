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
    <div className="flex gap-6 w-full">
      <Sidebar posts={allPosts} relatedPosts={relatedPosts} />
      <main className="w-full flex justify-center items-center pt-[40vh] pb-64 ml-[380px]">
        {children}
      </main>
    </div>
  );
}
