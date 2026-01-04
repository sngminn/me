'use client';
import { type MotionValue, motion, useMotionTemplate, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import { cn } from '@/src/lib/utils/cn';
import { DEFAULT_COLOR, TAG_COLORS } from '@/src/lib/utils/constants';
import { CAROUSEL_OVERLAP } from './constants';

interface Props {
  post: Post;
  index: number;
  containerScrollX: MotionValue<number>;
  dataIndex?: number;
  priority?: boolean;
}

export default function CarouselItem({ post, index, containerScrollX, priority = false }: Props) {
  const itemRef = useRef<HTMLLIElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [range, setRange] = useState([
    index * 320 - (320 - CAROUSEL_OVERLAP),
    index * 320,
    index * 320 + (320 - CAROUSEL_OVERLAP),
  ]);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const handleResize = () => {
      const width = el.offsetWidth;
      const centerScroll = el.offsetLeft + width / 2 - window.innerWidth / 2;

      const totalW = width - CAROUSEL_OVERLAP;
      const extend = window.innerWidth / 3;
      setRange([centerScroll - totalW - extend, centerScroll, centerScroll + totalW + extend]);
    };

    // 초기 실행
    handleResize();

    // ResizeObserver: 요소의 크기 변화 감지 (이미지 로딩, 폰트 변경 등)
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(el);

    // Window Resize: 화면 크기 변화 감지
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const rotateY = useTransform(containerScrollX, range, [20, 0, -20]);
  const scale = useTransform(containerScrollX, range, [0.8, 1, 0.8]);
  const y = useTransform(containerScrollX, range, [40, 0, 40]);
  const z = useTransform(containerScrollX, range, [-100, 0, -100]);
  const zIndex = useTransform(containerScrollX, range, [0, 10, 0]);
  const blurValue = useTransform(containerScrollX, range, [6, 0, 6]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  const mainTag = post.tags?.[0];
  const displayColor = (mainTag && TAG_COLORS[mainTag]) || DEFAULT_COLOR;

  return (
    <motion.li
      ref={itemRef}
      style={{
        rotateY,
        scale,
        y,
        z,
        zIndex,
        filter,
        marginRight: -CAROUSEL_OVERLAP,
      }}
      className="preserve-3d backface-hidden transform-sty snap-center snap-always will-change-transform last:mr-0"
      data-index={index}
    >
      <motion.div
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        transition={{
          duration: 1,
          delay: index * 0.07,
          ease: [0, 1, 0, 1],
        }}
        className="h-full w-full"
      >
        <Link
          href={`/posts/${post.slug}`}
          className="relative flex h-full w-[80vw] min-w-[300px] max-w-[360px] flex-col items-center justify-end rounded-2xl px-4 py-4"
        >
          {/* glow */}
          <div
            className="absolute bottom-0 aspect-3/4 w-full transform-gpu rounded-xl bg-(--tag-color) opacity-5 blur-[32px] will-change-filter"
            style={{ '--tag-color': displayColor } as React.CSSProperties}
          />

          <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl border-reflection">
            <Image
              src={post.thumbnail || '/thumbnail-fallback.jpg'}
              fill
              alt={`${post.title} 썸네일`}
              className={cn(
                'object-cover duration-700 ease-in-out',
                isLoading ? 'scale-110 blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'
              )}
              priority={priority}
              onLoad={() => setIsLoading(false)}
              sizes="(max-width: 768px) 80vw, 360px"
            />
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
