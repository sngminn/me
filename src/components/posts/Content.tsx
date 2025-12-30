'use client';

import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Tag } from '@/src/components/ui/Tag';
import type { Post } from '@/src/lib/obsidian/types';
import { longDate } from '@/src/lib/utils/day';

export default function Content({ post, children }: { post: Post; children: ReactNode }) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLHeadingElement | null>(null);

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
        className={`${scrolled ? 'translate-y-0' : '-translate-y-full'} transition-transform fixed top-0 gap-3 w-full max-w-[700px] left-1/2 -translate-x-1/2 px-3 py-2 flex items-center bg-bg-default border-b border-bg-subtle z-10`}
      >
        <Tag text={post.tags[0]} />
        <span className="text-xs text-text-highlight font-medium line-clamp-1">{post.title}</span>
      </div>
      <article className="max-w-[700px] m-auto px-3 pt-6 pb-40 flex flex-col gap-4 ">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={`/thumbnails/thumbnail_0${(post.title.length % 8) + 1}.png`}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <Tag text={post.tags[0]} />
        <h1 ref={sentinelRef} className="font-semibold text-2xl leading-[125%] text-text-highlight">
          {post.title}
        </h1>
        <span className="text-xs">{longDate(post.date)}</span>
        <hr className="text-bg-subtle" />
        <div className="prose dark:prose-invert w-full mt-8">{children}</div>
      </article>
    </>
  );
}
