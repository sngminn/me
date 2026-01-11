'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import { DEFAULT_COLOR, TAG_COLORS } from '@/src/lib/utils/constants';
import { relativeDate } from '@/src/lib/utils/day';

const VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    y: 5,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    y: 5,
    opacity: 0,
  }),
};

export default function TitleSync({
  activePost,
  activeIndex,
}: {
  activePost: Post;
  activeIndex: number;
}) {
  const mainTag = activePost.tags[0];
  const baseColor = TAG_COLORS[mainTag] || DEFAULT_COLOR;
  const displayColor = `hsl(from ${baseColor} h s 95)`;

  const [directionState, setDirectionState] = useState({
    prevIndex: activeIndex,
    direction: 1,
  });

  if (directionState.prevIndex !== activeIndex) {
    const direction = activeIndex > directionState.prevIndex ? 1 : -1;
    setDirectionState({
      prevIndex: activeIndex,
      direction,
    });
  }

  const { direction } = directionState;

  return (
    <div className="absolute top-[20vh] z-100 flex w-full justify-center">
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={activePost.slug}
          custom={direction}
          variants={VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute flex w-full flex-col items-center justify-center gap-2 px-8"
        >
          <h4
            className="break-keep text-center font-bold font-suite text-2xl text-transparent leading-[125%] md:text-4xl"
            style={
              {
                WebkitBackgroundClip: 'text',
                background: `linear-gradient(to bottom, #ffffff, ${displayColor})`,
                backgroundClip: 'text',
                viewTransitionName: `post-title-${activePost.slug}`,
              } as React.CSSProperties
            }
          >
            {activePost.title}
          </h4>
          <span className="font-medium text-[12px] text-white opacity-50 md:text-sm">
            {`${relativeDate(activePost.date)} · ${activePost.tags[0]?.replaceAll('_', ' ')}`}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
