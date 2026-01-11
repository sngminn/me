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
  const mainTag = post.tags?.[0];
  const color = (mainTag && TAG_COLORS[mainTag]) || DEFAULT_COLOR;
  const primary = `oklch(from ${color} 0.9 0.34 h)`; //TODO: util로 분리하기

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
        className={`${scrolled ? 'translate-y-0' : '-translate-y-full'} -translate-x-1/2 fixed top-0 left-1/2 z-10 flex w-full items-center justify-center border-bg-subtle border-b bg-[#000000e0] px-3 py-2 pt-13 backdrop-blur-2xl transition-transform`}
      >
        <div className="flex w-full max-w-[1080px] items-center gap-3">
          {post.tags[0] && <Tag text={post.tags[0]} color={primary} />}
          <span className="line-clamp-1 font-medium text-text-highlight text-xs">{post.title}</span>
        </div>
      </div>
      <article className="m-auto flex max-w-[700px] flex-col gap-4 bg-bg-default pb-40">
        <div className="relative aspect-square w-full bg-linear-to-t from-black to-transparent">
          <div className="absolute top-0 z-1 h-full w-full bg-linear-to-t from-bg-default to-transparent" />
          <div
            className="absolute h-full w-full"
            style={{ viewTransitionName: `post-thumbnail-${post.slug}` } as React.CSSProperties}
          >
            <Image
              src={post.thumbnail || '/thumbnail-fallback.jpg'}
              fill
              alt={`${post.title} 썸네일`}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <h1
          ref={sentinelRef}
          className="-mt-12 z-1 break-keep px-6 text-center font-semibold text-3xl text-text-highlight leading-[125%]"
          style={{ viewTransitionName: `post-title-${post.slug}` } as React.CSSProperties}
        >
          {post.title}
        </h1>
        <span className="text-center text-xs">
          {longDate(post.date) + (post.tags[0] && ` · ${post.tags[0].replaceAll('_', ' ')}`)}
        </span>
        <hr className="my-4 text-bg-subtle md:mt-16 md:mb-10" />
        <div
          className="prose dark:prose-invert mt-8 w-full px-3"
          style={{ '--marker-color': primary } as React.CSSProperties}
        >
          {children}
        </div>
      </article>
    </>
  );
}
