import { useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import CarouselItem from './CarouselItem';
import { CAROUSEL_OVERLAP } from './constants';
import TitleSync from './TitleSync';

export default function CarouselContainer({ posts }: { posts: Post[] }) {
  const containerRef = useRef<HTMLUListElement>(null);
  const { scrollX } = useScroll({ container: containerRef });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!Number.isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const items = container.querySelectorAll('li');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const activePost = posts[activeIndex] || posts[0];
  return (
    <div className="relative w-full h-full flex flex-col justify-center ">
      <TitleSync activePost={activePost} activeIndex={activeIndex} />
      <ul
        ref={containerRef}
        className="flex h-full pt-4 overflow-scroll hide-scrollbar snap-x snap-mandatory scroll-smooth transform-3d perspective-midrange"
        style={{
          paddingLeft: 'calc(50vw - min(40vw, 200px))',
          paddingRight: `calc(50vw - min(40vw, 200px) + ${CAROUSEL_OVERLAP}px)`,
        }}
      >
        {posts.map((post, index) => (
          <CarouselItem
            post={post}
            key={post.slug}
            index={index}
            containerScrollX={scrollX}
            dataIndex={index}
          />
        ))}
      </ul>
    </div>
  );
}
