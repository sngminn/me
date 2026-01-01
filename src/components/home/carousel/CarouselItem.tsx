'use client';
import { type MotionValue, motion, useTransform } from 'framer-motion';
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
}

export default function CarouselItem({ post, index, containerScrollX }: Props) {
  const itemRef = useRef<HTMLLIElement>(null);
  const [myPosition, setMyPosition] = useState(index * 320);
  const [cardWidth, setCardWidth] = useState(320);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const handleResize = () => {
      const width = el.offsetWidth;
      setCardWidth(width);
      const centerScroll = el.offsetLeft + width / 2 - window.innerWidth / 2;
      setMyPosition(centerScroll);
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

  // 카드 하나가 차지하는 실질적 공간 = 너비 - 겹치는 부분
  const totalWidth = cardWidth - CAROUSEL_OVERLAP;
  const range = [myPosition - totalWidth, myPosition, myPosition + totalWidth];
  const rotateY = useTransform(containerScrollX, range, [20, 0, -20]);
  const scale = useTransform(containerScrollX, range, [0.8, 1, 0.8]);
  const opacity = useTransform(containerScrollX, range, [0.5, 1, 0.5]);
  const y = useTransform(containerScrollX, range, [40, 0, 40]);
  const z = useTransform(containerScrollX, range, [-50, 0, -50]);
  const zIndex = useTransform(containerScrollX, range, [0, 10, 0]);

  return (
    <motion.li
      ref={itemRef}
      style={{
        rotateY,
        scale,
        opacity,
        y,
        z,
        zIndex,
        marginRight: -CAROUSEL_OVERLAP,
      }}
      className="snap-center last:mr-0"
      data-index={index}
    >
      <Link
        href={`/posts/${post.slug}`}
        className="w-[80vw] max-w-[400px] min-w-[300px] h-full justify-end flex flex-col px-4 py-4 rounded-2xl "
      >
        <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden">
          <Image
            src={post.thumbnail || '/thumbnail-fallback.jpg'}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </Link>
    </motion.li>
  );
}
