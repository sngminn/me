'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import CarouselContainer from './carousel/CarouselContainer';
import TabContainer from './tab/TabContainer';

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState('');
  const tags = useMemo(() => new Set(posts.map((post) => post.tags[0]).filter(Boolean)), [posts]);
  const filteredPosts = posts.filter((post) => post.tags.includes(activeTab) || activeTab === '');

  return (
    <div className="relative h-screen flex flex-col">
      <div className="w-full max-w-[1080px] mx-auto z-200">
        <header className="flex justify-between items-center px-4 py-3">
          <Link href={'/'}>
            <span className="font-suite font-black tracking-tighter text-sm">Kim Seungmin _</span>
          </Link>
          <button type="button">
            <Menu />
          </button>
        </header>
        <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} tags={tags} />
      </div>
      <CarouselContainer posts={filteredPosts} key={activeTab} />
    </div>
  );
}
