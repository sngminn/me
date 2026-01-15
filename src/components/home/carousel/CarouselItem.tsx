import { type MotionValue, motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import ViewTransitionLink from '@/src/components/common/ViewTransitionLink';
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

export default function CarouselItem({
  post,
  index,
  containerScrollX,
  priority = false,
  range = [0, 0, 0],
}: Props) {
  const itemRef = useRef<HTMLLIElement>(null);
  const rotateY = useTransform(containerScrollX, range, [20, 0, -20]);
  const scale = useTransform(containerScrollX, range, [0.8, 1, 0.8]);
  const y = useTransform(containerScrollX, range, [40, 0, 40]);
  const z = useTransform(containerScrollX, range, [-100, 0, -100]);
  const zIndex = useTransform(containerScrollX, range, [0, 10, 0]);
  // const blurValue = useTransform(containerScrollX, range, [6, 0, 6]);
  // const filter = useMotionTemplate`blur(${blurValue}px)`;

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
        // filter,
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
        <ViewTransitionLink
          href={`/posts/${post.slug}`}
          className="relative flex h-full w-[80vw] min-w-[300px] max-w-[360px] flex-col items-center justify-end rounded-2xl px-4 py-4"
        >
          <div
            className="absolute bottom-0 aspect-3/4 w-full transform-gpu opacity-60"
            style={{
              background: `linear-gradient(to top, ${displayColor}, transparent 50%)`,
            }}
          />

          <div
            className="relative aspect-3/4 w-full overflow-hidden rounded-xl border-reflection bg-neutral-900"
            style={{ viewTransitionName: `post-thumbnail-${post.slug}` } as React.CSSProperties}
          >
            <Image
              src={post.thumbnail || '/thumbnail-fallback.jpg'}
              fill
              alt={`${post.title} 썸네일`}
              className="object-cover duration-700 ease-in-out"
              priority={priority}
            />
          </div>
        </ViewTransitionLink>
      </motion.div>
    </motion.li>
  );
}
