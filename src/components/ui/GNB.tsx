'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';

interface MenuHandlerProps {
  menuHandler: () => void;
}

export default function GNB({ menuHandler }: MenuHandlerProps) {
  return (
    <header className="flex justify-between items-center bg-linear-to-b from-bg-default to-transparent">
      <Link href={'/'}>
        <span
          className="text-transparent bg-clip-text bg-linear-to-b from-40% from-white to-90% to-indigo-200 font-suite font-black tracking-tighter text-sm px-4 py-3"
          style={{ WebkitBackgroundClip: 'text' }}
        >
          Kim Seungmin _
        </span>
      </Link>
      <button type="button" onClick={menuHandler} className="cursor-pointer px-4 py-3 text-white">
        <Menu />
      </button>
    </header>
  );
}
