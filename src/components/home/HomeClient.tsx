'use client';

import { useMemo, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import CarouselContainer from './carousel/CarouselContainer';
import TabContainer from './tab/TabContainer';

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState('');
  const tags = useMemo(
    () => new Set(posts.map((post) => post.tags[0]).filter((tag): tag is string => Boolean(tag))),
    [posts]
  );
  const filteredPosts = posts.filter((post) => post.tags.includes(activeTab) || activeTab === '');
  return (
    <div className="relative h-screen flex flex-col">
      <div className="w-full max-w-[1080px] mx-auto z-100">
        <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} tags={tags} />
      </div>
      <CarouselContainer posts={filteredPosts} key={activeTab} />
    </div>
  );
}
