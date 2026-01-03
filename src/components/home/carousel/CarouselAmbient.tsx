'use client';
import { type MotionValue, motion, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import { DEFAULT_COLOR, TAG_COLORS } from '@/src/lib/utils/constants';
import { CAROUSEL_OVERLAP } from './constants';

interface Props {
  post: Post;
  index: number;
  containerScrollX: MotionValue<number>;
  dataIndex?: number;
  priority?: boolean;
}

export default function CarouselAmbient({ post, index, containerScrollX }: Props) {
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

    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(el);

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const scale = useTransform(containerScrollX, range, [0.8, 1, 0.8]);
  const y = useTransform(containerScrollX, range, [40, 0, 40]);
  const z = useTransform(containerScrollX, range, [-100, 0, -100]);
  const zIndex = useTransform(containerScrollX, range, [0, 10, 0]);

  const mainTag = post.tags[0];
  const displayColor = TAG_COLORS[mainTag] || DEFAULT_COLOR;

  return (
    <motion.li
      ref={itemRef}
      style={{
        scale,
        y,
        z,
        zIndex,
        marginRight: -CAROUSEL_OVERLAP,
      }}
      className="snap-center snap-always last:mr-0 will-change-transform preserve-3d backface-hidden mix-blend-plus-lighter"
      data-index={index}
    >
      <div className="relative w-[80vw] max-w-[360px] min-w-[300px] h-full flex justify-center">
        {/* glow */}
        <div
          className="absolute bottom-0 w-full aspect-3/4 opacity-10 rounded-xl bg-(--tag-color) blur-[128px] transform-gpu will-change-filter"
          style={{ '--tag-color': displayColor } as React.CSSProperties}
        />

        {/* top atmosphere */}
        <div
          className="absolute -top-20 w-[90vw] h-[20vh] opacity-10 md:opacity-5 bg-(--tag-color) blur-[128px] transform-gpu will-change-filter"
          style={{ '--tag-color': displayColor } as React.CSSProperties}
        />
      </div>
    </motion.li>
  );
}
