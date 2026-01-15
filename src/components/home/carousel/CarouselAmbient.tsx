'use client';
import { type MotionValue, motion, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import { DEFAULT_COLOR, TAG_COLORS } from '@/src/lib/utils/constants';
import { CAROUSEL_OVERLAP } from './constants';

interface Props {
  post: Post;
  index: number;
  containerScrollX: MotionValue<number>;
  dataIndex?: number;
  priority?: boolean;
  range?: number[];
}

export default function CarouselAmbient({
  post,
  index,
  containerScrollX,
  range = [0, 0, 0],
}: Props) {
  const itemRef = useRef<HTMLLIElement>(null);
  const scale = useTransform(containerScrollX, range, [0.8, 1, 0.8]);
  const y = useTransform(containerScrollX, range, [40, 0, 40]);
  const z = useTransform(containerScrollX, range, [-100, 0, -100]);
  const zIndex = useTransform(containerScrollX, range, [0, 10, 0]);

  const mainTag = post.tags?.[0];
  const displayColor = (mainTag && TAG_COLORS[mainTag]) || DEFAULT_COLOR;

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
      className="preserve-3d backface-hidden snap-center snap-always mix-blend-plus-lighter will-change-transform last:mr-0"
      data-index={index}
    >
      <div className="relative flex h-full w-[80vw] min-w-[300px] max-w-[360px] justify-center">
        {/* glow */}
        <div
          className="absolute bottom-0 aspect-3/4 w-full transform-gpu rounded-xl bg-(--tag-color) opacity-10 blur-[128px] will-change-filter"
          style={{ '--tag-color': displayColor } as React.CSSProperties}
        />

        {/* top atmosphere */}
        <div
          className="-top-20 absolute h-[20vh] w-[90vw] transform-gpu bg-(--tag-color) opacity-10 blur-[128px] will-change-filter md:opacity-5"
          style={{ '--tag-color': displayColor } as React.CSSProperties}
        />
      </div>
    </motion.li>
  );
}
