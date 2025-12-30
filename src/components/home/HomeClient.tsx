'use client';

import { ArrowRight, Github, Instagram, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/obsidian/types';
import { Sidebar } from '../layout/Sidebar';
import AsciiVideo from '../ui/AsciiVideo';

interface Footer {
  name: string;
  url: string;
}

const footers = {
  github: { name: 'sngminn', url: 'https://github.com/sngminn' },
  instagram: { name: 'solmin.works', url: 'https://www.instagram.com/solmin.works/' },
  email: { name: 'me@kimseungmin.dev', url: 'mailto:me@kimseungmin.dev' },
} as const satisfies Record<string, Footer>;

type footerType = keyof typeof footers;

function FooterIcon({ type, className }: { type: footerType; className: string }) {
  if (type === 'github') return <Github className={className} />;
  if (type === 'instagram') return <Instagram className={className} />;
  if (type === 'email') return <Mail className={className} />;
}

function FooterBelt({ type }: { type: footerType }) {
  return (
    <a href={footers[type].url} target="_blank" rel="noopener noreferrer">
      <div
        className="w-[120vw] h-16 bg-bg-default -translate-x-8 flex whitespace-nowrap items-center overflow-hidden"
        style={{ rotate: `${type.length * 4 - 30}deg` }}
      >
        <div className="flex animate-scroll gap-3">
          {Array(8)
            .fill('')
            .map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: only for repeat
                key={i}
                className="flex whitespace-nowrap items-center gap-3 shrink-0"
              >
                <FooterIcon className="text-primary-main" type={type} />
                <span className="text-primary-main uppercase whitespace-nowrap font-extrabold">
                  {type}
                </span>
                <ArrowRight className="text-primary-main" />
                <span className="text-primary-main uppercase whitespace-nowrap font-extrabold">
                  {footers[type].name}
                </span>
                <ArrowRight className="text-primary-main" />
              </div>
            ))}
        </div>
      </div>
    </a>
  );
}

function HeroSection({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 max-w-[1080px] w-full h-full overflow-hidden">
      <div
        className={`${isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} absolute flex flex-col gap-18 mt-[45vh]`}
      >
        {Object.keys(footers).map((type) => (
          <FooterBelt key={type} type={type as footerType} />
        ))}
      </div>
      <div
        className={`${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} absolute flex flex-col h-[70vh] w-full justify-end items-start`}
      >
        <AsciiVideo className="absolute top-0 -right-[250px]" />
        <div className="flex flex-col gap-6 p-8 h-full justify-end">
          <span className="text-primary-bg text-2xl font-bold">
            프론트엔드 개발자
            <br />
            김승민입니다
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HomeClient({ allPosts }: { allPosts: Post[] }) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    function handleScroll() {
      const threshold = window.innerHeight * 0.7;
      setIsScrolled(window.scrollY > threshold);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary-main ">
      <HeroSection isScrolled={isScrolled} />
      <Sidebar posts={allPosts} className="my-[70vh] z-10" />
    </div>
  );
}
