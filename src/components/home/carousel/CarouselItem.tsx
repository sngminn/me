'use client';
import { type MotionValue, motion, useMotionTemplate, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
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
      className="snap-center snap-always last:mr-0 will-change-transform preserve-3d backface-hidden"
      data-index={index}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="relative w-[80vw] max-w-[360px] min-w-[300px] h-full flex flex-col justify-end items-center px-4 py-4 rounded-2xl "
      >
        {/* glow */}
        <div className="blur-xl opacity-10 absolute bottom-0 w-full aspect-3/4 rounded-xl overflow-hidden hidden md:block">
          <Image
            src={post.thumbnail || '/thumbnail-fallback.jpg'}
            fill
            alt={`${post.title} 썸네일`}
            className="object-cover"
            priority={priority}
          />
        </div>

        {/* top atmosphere */}
        <div className="blur-[200px] opacity-10 scale-200 absolute -top-50 w-full aspect-3/4 rounded-xl overflow-hidden hidden md:block">
          <Image
            src={post.thumbnail || '/thumbnail-fallback.jpg'}
            fill
            alt={`${post.title} 썸네일`}
            className="object-cover"
            priority={priority}
          />
        </div>

        <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden border-reflection">
          <Image
            src={post.thumbnail || '/thumbnail-fallback.jpg'}
            fill
            alt={`${post.title} 썸네일`}
            className="object-cover"
            priority={priority}
          />
        </div>
      </Link>
    </motion.li>
  );
}
