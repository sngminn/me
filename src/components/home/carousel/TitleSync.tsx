'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Tag } from '@/src/components/ui/Tag';
import type { Post } from '@/src/lib/obsidian/types';
import { relativeDate } from '@/src/lib/utils/day';

const VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
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
    <div className="relative h-20 w-full flex justify-center overflow-hidden">
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
          className="absolute flex flex-col px-8 gap-2 justify-center items-center w-full"
        >
          {activePost.tags[0] && <Tag text={activePost.tags[0]} />}
          <h4
            className={`text-text-highlight text-center leading-[125%] break-keep font-semibold text-[18px]`}
          >
            {activePost.title}
          </h4>
          <span className="text-[12px] font-medium">{relativeDate(activePost.date)}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
