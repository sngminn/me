'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';

interface MenuHandlerProps {
  menuHandler: () => void;
}

export default function GNB({ menuHandler }: MenuHandlerProps) {
  return (
    <header className="flex w-full max-w-[1080px] items-center justify-between bg-linear-to-b from-bg-default to-transparent">
      <Link href={'/'}>
        <span className="bg-linear-to-b from-40% from-white to-90% to-indigo-200 bg-clip-text px-4 py-3 font-black font-suite text-sm text-transparent tracking-tighter">
          Kim Seungmin _
        </span>
      </Link>
      <button type="button" onClick={menuHandler} className="cursor-pointer px-4 py-3 text-white">
        <Menu />
      </button>
    </header>
  );
}
