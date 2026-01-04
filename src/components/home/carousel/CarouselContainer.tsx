import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import CarouselAmbient from './CarouselAmbient';
import CarouselItem from './CarouselItem';
import { CAROUSEL_OVERLAP } from './constants';
import TitleSync from './TitleSync';

export default function CarouselContainer({ posts }: { posts: Post[] }) {
  const containerRef = useRef<HTMLUListElement>(null);
  const { scrollX } = useScroll({ container: containerRef });
  const [activeIndex, setActiveIndex] = useState(0);
  const negativeScrollX = useTransform(scrollX, (v) => -v);

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
    <div className="absolute h-full w-full overflow-hidden">
      <div className="vignette pointer-events-none absolute inset-0 z-10 h-full w-full bg-black" />
      <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 z-50 h-[50vh] w-[120vw] translate-y-1/2 bg-black blur-[100px]" />
      <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 z-50 h-[50vh] w-[200vw] bg-linear-to-t from-black to-transparent" />
      <TitleSync activePost={activePost} activeIndex={activeIndex} />
      <motion.ul
        className="hide-scrollbar transform-3d perspective-midrange preserve-3d absolute flex h-full snap-x snap-mandatory overflow-scroll scroll-smooth pt-4 pb-[8vh]"
        style={{
          x: negativeScrollX,
          paddingLeft: 'calc(50vw - min(40vw, 200px))',
          paddingRight: `calc(50vw - min(40vw, 200px) + ${CAROUSEL_OVERLAP}px)`,
        }}
      >
        {posts.map((post, index) => (
          <CarouselAmbient post={post} key={post.slug} index={index} containerScrollX={scrollX} />
        ))}
      </motion.ul>

      <ul
        ref={containerRef}
        className="hide-scrollbar transform-3d perspective-midrange preserve-3d flex h-full snap-x snap-mandatory overflow-scroll scroll-smooth pt-4 pb-[8vh]"
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
