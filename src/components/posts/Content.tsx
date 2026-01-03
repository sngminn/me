'use client';

import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Tag } from '@/src/components/ui/Tag';
import type { Post } from '@/src/lib/obsidian/types';
import { DEFAULT_COLOR, TAG_COLORS } from '@/src/lib/utils/constants';
import { longDate } from '@/src/lib/utils/day';

export default function Content({ post, children }: { post: Post; children: ReactNode }) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLHeadingElement | null>(null);
  const mainTag = post.tags[0];
  const displayColor = TAG_COLORS[mainTag] || DEFAULT_COLOR;

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver((entry) => {
      const target = entry[0];
      setScrolled(!target.isIntersecting);
    });

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className={`${scrolled ? 'translate-y-0' : '-translate-y-full'} flex items-center justify-center transition-transform fixed top-0 w-full left-1/2 -translate-x-1/2 px-3 py-2 pt-13 bg-[#000000e0] backdrop-blur-2xl border-b border-bg-subtle z-10`}
      >
        <div className="flex gap-3 w-full max-w-[1080px] items-center">
          {post.tags[0] && <Tag text={post.tags[0]} color={displayColor} />}
          <span className="text-xs text-text-highlight font-medium line-clamp-1">{post.title}</span>
        </div>
      </div>
      <article className="max-w-[700px] m-auto pb-40 flex flex-col gap-4 bg-bg-default">
        <div className="relative w-full aspect-square bg-linear-to-t from-black to-transparent">
          <div className="absolute bg-linear-to-t from-bg-default to-transparent w-full h-full top-0 z-1" />
          <Image
            src={post.thumbnail || '/thumbnail-fallback.jpg'}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <h1
          ref={sentinelRef}
          className="font-semibold text-3xl leading-[125%] px-6 -mt-12 z-1 text-text-highlight text-center break-keep"
        >
          {post.title}
        </h1>
        <span className="text-xs text-center">
          {longDate(post.date) + (post.tags[0] && ` · ${post.tags[0].replaceAll('_', ' ')}`)}
        </span>
        <hr className="text-bg-subtle" />
        <div
          className="prose dark:prose-invert w-full mt-8 px-3"
          style={{ '--marker-color': displayColor } as React.CSSProperties}
        >
          {children}
        </div>
      </article>
    </>
  );
}
