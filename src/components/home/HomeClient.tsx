'use client';

import { Instagram, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Post } from '@/src/lib/obsidian/types';
import CarouselContainer from './carousel/CarouselContainer';
import TabContainer from './tab/TabContainer';

const MenuItems = ['github', 'instagram', 'email'] as const;

interface MenuItemProps {
  item: (typeof MenuItems)[number];
}

function MenuItem({ item }: MenuItemProps) {
  return (
    <li className="flex gap-1 justify-center items-center px-8 py-3">
      <Instagram />
      <span>{item}</span>
    </li>
  );
}

interface MenuContainerProps {
  menuHandler: () => void;
}

function MenuContainer({ menuHandler }: MenuContainerProps) {
  return (
    <div className="fixed flex justify-center items-center inset-0 z-800 backdrop-blur-xl bg-[#000000a0] w-screen h-screen">
      <div className="max-w-[1080px] w-full fixed top-0 mx-auto flex justify-end">
        <button type="button" onClick={menuHandler} className="cursor-pointer px-4 py-3">
          <X />
        </button>
      </div>
      <ul className="flex flex-col gap-12">
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
  const tags = useMemo(() => new Set(posts.map((post) => post.tags[0]).filter(Boolean)), [posts]);
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
            <span className="font-suite font-black tracking-tighter text-sm px-4 py-3">
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
