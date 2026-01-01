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
        threshold: 0, // 중앙 선에 닿자마자 감지
        rootMargin: '0px -50% 0px -50%', // 좌우 50%씩 깎아서 중앙선만 남김
      }
    );

    const items = container.querySelectorAll('li');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const activePost = posts[activeIndex] || posts[0];
  if (!activePost) return null;

  return (
    <div className="absolute w-full h-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-black pointer-events-none z-10 vignette" />
      <div className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 bottom-0 w-[120vw] h-[50vh] bg-black z-50 blur-[100px] pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[8vh] bottom-0 w-[200vw] h-[30vh] bg-linear-to-t from-black to-transparent pointer-events-none z-50" />
      <TitleSync activePost={activePost} activeIndex={activeIndex} />
      <ul
        ref={containerRef}
        className="h-full flex pt-4 pb-[8vh] overflow-scroll hide-scrollbar snap-x snap-mandatory scroll-smooth transform-3d perspective-midrange preserve-3d"
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
            priority={index === 0}
          />
        ))}
      </ul>
    </div>
  );
}
