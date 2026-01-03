'use client';

import { ExternalLink, Github, Instagram, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useMemo, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import CarouselContainer from './carousel/CarouselContainer';
import TabContainer from './tab/TabContainer';

const MenuItems = ['github', 'instagram', 'email'] as const;

interface MenuItemProps {
  item: (typeof MenuItems)[number];
}

const MenuMap = {
  github: GithubMenu,
  instagram: InstagramMenu,
  email: EmailMenu,
} as const;

function GithubMenu({ children, className }: { children: ReactNode; className: string }) {
  return (
    <a
      href="https://github.com/sngminn"
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github className="w-9 h-9 text-white" />
      <span>{children}</span>
      <ExternalLink className="opacity-50 text-white" />
    </a>
  );
}
function InstagramMenu({ children, className }: { children: ReactNode; className: string }) {
  return (
    <a
      href="https://www.instagram.com/solmin.works/"
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Instagram className="w-9 h-9 text-white" />
      <span>{children}</span>
      <ExternalLink className="opacity-50 text-white" />
    </a>
  );
}

function EmailMenu({ children, className }: { children: ReactNode; className: string }) {
  async function clickHandler() {
    try {
      await navigator.clipboard.writeText('me@kimseungmin.dev');
    } catch (e) {
      console.log('클립보드 복사 실패:', e);
    }
  }
  return (
    <button type="button" onClick={clickHandler} className={className}>
      <Mail className="w-9 h-9 text-white" />
      <span>{children}</span>
    </button>
  );
}

function MenuItem({ item }: MenuItemProps) {
  const MenuComp = MenuMap[item];
  return (
    <li className="px-8 py-3 flex justify-center items-center">
      <MenuComp className="text-transparent bg-clip-text bg-linear-to-b from-white to-indigo-100 cursor-pointer text-4xl font-suite uppercase font-bold flex gap-4 justify-center items-center ">
        {item}
      </MenuComp>
    </li>
  );
}

interface MenuContainerProps {
  menuHandler: () => void;
}

function MenuContainer({ menuHandler }: MenuContainerProps) {
  return (
    <div className="fixed flex justify-center items-center inset-0 z-800 w-screen h-screen">
      <button
        type="button"
        onClick={(e) => {
          if (e.target === e.currentTarget) menuHandler();
        }}
        className="absolute backdrop-blur-xl bg-[#000000a0] w-full h-full -z-10"
      />
      <div className="max-w-[1080px] w-full fixed top-0 mx-auto flex justify-end">
        <button
          type="button"
          onClick={menuHandler}
          className="cursor-pointer px-4 py-3 border-none bg-transparent text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <ul className="flex flex-col gap-12 list-none p-0 m-0">
        {MenuItems.map((item) => (
          <MenuItem key={item} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const tags = useMemo(
    () => new Set(posts.map((post) => post.tags[0]).filter((tag): tag is string => Boolean(tag))),
    [posts]
  );
  const filteredPosts = posts.filter((post) => post.tags.includes(activeTab) || activeTab === '');

  function handleMenuClick() {
    setShowMenu((prev) => !prev);
  }

  return (
    <div className="relative h-screen flex flex-col">
      {showMenu && <MenuContainer menuHandler={handleMenuClick} />}
      <div className="w-full max-w-[1080px] mx-auto z-200">
        <header className="flex justify-between items-center">
          <Link href={'/'}>
            <span className="text-transparent bg-clip-text bg-linear-to-b from-40% from-white to-90% to-indigo-200 font-suite font-black tracking-tighter text-sm px-4 py-3">
              Kim Seungmin _
            </span>
          </Link>
          <button type="button" onClick={handleMenuClick} className="cursor-pointer px-4 py-3">
            {showMenu ? <X /> : <Menu />}
          </button>
        </header>
        <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} tags={tags} />
      </div>
      <CarouselContainer posts={filteredPosts} key={activeTab} />
    </div>
  );
}
