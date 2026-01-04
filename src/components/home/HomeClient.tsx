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
    <div className="relative flex h-screen flex-col">
      <div className="z-100 mx-auto mt-7 w-full max-w-[1080px]">
        <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} tags={tags} />
      </div>
      <CarouselContainer posts={filteredPosts} key={activeTab} />
    </div>
  );
}
