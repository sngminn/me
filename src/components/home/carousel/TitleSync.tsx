'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
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
    <div className="absolute top-[20vh] w-full flex justify-center z-100">
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
          <h4
            className={`text-text-highlight text-2xl text-center leading-[125%] break-keep font-bold font-suite`}
          >
            {activePost.title}
          </h4>
          <span className="text-[12px] font-medium">
            {`${relativeDate(activePost.date)} · ${activePost.tags[0]?.replaceAll('_', ' ')}`}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
