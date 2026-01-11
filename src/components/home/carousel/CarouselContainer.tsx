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
        threshold: 0,
        rootMargin: '0px -50% 0px -50%',
      }
    );

    const items = container.querySelectorAll('li');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const [layout, setLayout] = useState({ width: 320, paddingLeft: 0, windowWidth: 0 });

  useEffect(() => {
    const handleResize = () => {
      const windowW = window.innerWidth;
      // CSS: w-[80vw] min-w-[300px] max-w-[360px]
      const w = Math.min(360, Math.max(300, windowW * 0.8));

      // CSS: paddingLeft: 'calc(50vw - min(40vw, 200px))'
      const halfItemParam = Math.min(windowW * 0.4, 200);
      const paddingL = windowW * 0.5 - halfItemParam;

      setLayout({ width: w, paddingLeft: paddingL, windowWidth: windowW });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRange = (index: number) => {
    const { width, paddingLeft, windowWidth } = layout;
    if (windowWidth === 0) return undefined;

    const offsetLeft = paddingLeft + index * (width - CAROUSEL_OVERLAP);
    const centerScroll = offsetLeft + width / 2 - windowWidth / 2;
    const totalW = width - CAROUSEL_OVERLAP;
    const extend = windowWidth / 3;

    return [centerScroll - totalW - extend, centerScroll, centerScroll + totalW + extend];
  };

  const activePost = posts[activeIndex] || posts[0];
  if (!activePost) return null;

  return (
    <div className="absolute h-full w-full overflow-hidden">
      <div className="vignette pointer-events-none absolute inset-0 z-10 h-full w-full bg-black" />
      <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 z-50 h-[50vh] w-[120vw] translate-y-1/2 bg-black blur-[100px]" />
      <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 z-50 h-[50vh] w-[200vw] bg-linear-to-t from-black to-transparent" />
      <TitleSync activePost={activePost} activeIndex={activeIndex} />
      <motion.ul
        className="hide-scrollbar transform-3d perspective-midrange preserve-3d pointer-events-none absolute flex h-full pt-4 pb-[8vh]"
        style={{
          x: negativeScrollX,
          paddingLeft: 'calc(50vw - min(40vw, 200px))',
          paddingRight: `calc(50vw - min(40vw, 200px) + ${CAROUSEL_OVERLAP}px)`,
        }}
      >
        {posts.map((post, index) => (
          <CarouselAmbient
            post={post}
            key={post.slug}
            index={index}
            containerScrollX={scrollX}
            range={getRange(index)}
          />
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
            range={getRange(index)}
          />
        ))}
      </ul>
    </div>
  );
}
