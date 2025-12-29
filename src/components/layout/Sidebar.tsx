'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type MouseEventHandler, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import { relativeDate } from '@/src/lib/utils/day';
import { Tag } from '../ui/Tag';

interface SidebarProps {
  posts: Post[];
  className?: string;
}

export function TabButton({
  content,
  active = false,
  onClick,
}: {
  content: string;
  active?: boolean;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      type="button"
      className={`${active ? 'bg-white text-text-inverse' : 'bg-bg-subtle border-text-default text-text-subtle'} text-sm flex justify-center whitespace-nowrap items-center rounded-full px-3 py-1 font-medium cursor-pointer`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

function SidebarContent({ post }: { post: Post }) {
  return (
    <li className="w-full flex flex-col px-4 py-4 rounded-2xl">
      <Link href={`/posts/${post.slug}`}>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={`/thumbnails/thumbnail_0${(post.title.length % 8) + 1}.png`}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center mt-2">
              <Tag text={post.tags[0]} />
            </div>
            <div className="pl-2">
              <h4 className={`text-text-highlight leading-[125%] font-semibold text-[18px]`}>
                {post.title}
              </h4>
              <span className="text-[12px] font-medium">{relativeDate(post.date)}</span>
            </div>
          </div>
          <button
            type="button"
            className="w-[38px] h-[38px] aspect-square bg-white rounded-full flex justify-center items-center"
          >
            <ArrowRight className="w-4 stroke-black" />
          </button>
        </div>
      </Link>
    </li>
  );
}

export function Sidebar({ posts, className }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('');
  const tags = new Set<string>();

  posts.forEach((post) => {
    tags.add(post.tags[0]);
  });

  return (
    <aside
      className={`${className} w-full min-h-screen bg-bg-default rounded-3xl pb-8 squircle shadow-2xl`}
    >
      <div className="max-w-[720px] m-auto relative">
        <div className="w-12 h-1 rounded-full bg-bg-inverse mx-auto mt-3" />
        <div className="flex w-full overflow-x-scroll hide-scrollbar gap-2 px-3 py-4 mt-4 sticky top-0 z-10 bg-bg-default border-b border-bg-subtle">
          <TabButton content="모든 글" active={!activeTab} onClick={() => setActiveTab('')} />
          {[...tags].map((tag) => (
            <TabButton
              key={tag}
              content={tag}
              active={activeTab === tag}
              onClick={() => setActiveTab(tag)}
            />
          ))}
        </div>
        <ul className="flex flex-col gap-4 pt-4 w-full">
          {posts.map((post, ind) => (
            <div key={post.slug}>
              <SidebarContent post={post} />
              {ind !== posts.length - 1 && <hr className=" my-4 mx-3 text-bg-subtle" />}
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
}
