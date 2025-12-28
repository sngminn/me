'use client';

import { ArrowRight, Github, Instagram, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/obsidian/types';
import { Sidebar } from '../layout/Sidebar';
import AsciiVideo from '../ui/AsciiVideo';

const footers = {
  github: 'sngminn',
  instagram: 'solmin.works',
  email: 'me@kimseungmin.dev',
} as const;

type footerType = keyof typeof footers;

function FooterIcon({ type, className }: { type: footerType; className: string }) {
  if (type === 'github') return <Github className={className} />;
  if (type === 'instagram') return <Instagram className={className} />;
  if (type === 'email') return <Mail className={className} />;
}

function FooterBelt({ type }: { type: footerType }) {
  return (
    <div
      className="w-[120vw] h-16 bg-bg-default -translate-x-8 flex whitespace-nowrap items-center overflow-hidden"
      style={{ rotate: `${type.length * 4 - 30}deg` }}
    >
      <div className="flex animate-scroll gap-3">
        {Array(4)
          .fill('')
          .map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: only for repeat
              key={i}
              className="flex whitespace-nowrap items-center gap-3 shrink-0"
            >
              <FooterIcon className="text-primary-main" type={type} />
              <span className='text-primary-main uppercase whitespace-nowrap font-extrabold font-["SUITE"]'>
                {type}
              </span>
              <ArrowRight className="text-primary-main" />
              <span className='text-primary-main uppercase whitespace-nowrap font-extrabold font-["SUITE"]'>
                {footers[type]}
              </span>
              <ArrowRight className="text-primary-main" />
            </div>
          ))}
      </div>
    </div>
  );
}

function HeroSection({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 max-w-[1080px] w-full h-full overflow-hidden">
      <div
        className={`${isScrolled ? 'opacity-100' : 'opacity-0'} absolute flex flex-col gap-18 mt-[45vh]`}
      >
        {Object.keys(footers).map((type) => (
          <FooterBelt key={type} type={type as footerType} />
        ))}
      </div>
      <div
        className={`${isScrolled ? 'opacity-0' : 'opacity-100'} absolute flex-col h-[70vh] w-full justify-end items-start`}
      >
        <AsciiVideo className="absolute top-0 -right-[250px]" />
        <div className="flex flex-col gap-6 p-8 h-full justify-end">
          <h1 className='text-primary-bg text-4xl whitespace-nowrap font-extrabold font-["SUITE"]'>
            {`<프론트엔드 />개발자`}
            <br />
            {`{김승민}입니다_`}
          </h1>
          <span className="text-primary-bg">개발, 디자인 이것저것 만듭니다</span>
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
