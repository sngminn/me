import { ArrowRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/src/lib/obsidian/types';
import { relativeDate } from '@/src/lib/utils/day';

interface SidebarProps {
  posts: Post[];
  className?: string;
}

function Tag({ text }: { text: string }) {
  return (
    <div className="flex items-center">
      <div className="text-[#FFC908] bg-[#453600] rounded-l-full px-3 py-1 text-[11px] font-medium  uppercase leading-none">
        {text}
      </div>
      <div className="w-2.5">
        <svg
          viewBox="0 0 10 20"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="#453600"
          stroke="#FFC908"
        >
          <path d="M0 0 L10 10 L0 20" />
        </svg>
      </div>
    </div>
  );
}

function TabButton({ content }: { content: string }) {
  return (
    <button
      type="button"
      className="text-base flex justify-center whitespace-nowrap items-center bg-white rounded-full text-text-inverse px-4 py-1 font-semibold"
    >
      {content} <ArrowRight className="w-4" />
    </button>
  );
}

function SidebarContent({ post }: { post: Post }) {
  return (
    <li className="w-full flex flex-col hover:bg-bg-subtle px-4 py-4 rounded-xl">
      <Link href={`/posts/${post.slug}`}>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={'/thumbnails/thumbnail_01.png'}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center mt-2">
              <Tag text={'JavaScript'} />
            </div>
            <div className="pl-2">
              <h4 className={`text-text-bright font-bold text-[18px] font-suite`}>{post.title}</h4>
              <span className="text-[12px] font-medium">{relativeDate(post.date)}</span>
            </div>
          </div>
          <button
            type="button"
            className="w-[38px] h-[38px] bg-white rounded-full flex justify-center items-center"
          >
            <ArrowRight className="w-4 stroke-black" />
          </button>
        </div>
      </Link>
    </li>
  );
}

export function Sidebar({ posts, className }: SidebarProps) {
  return (
    <aside className={`${className} w-full min-h-screen bg-bg-default rounded-3xl`}>
      <div className="max-w-[720px] m-auto">
        <div className="flex justify-between px-6 py-5">
          <h3 className="text-[18px] font-bold text-text-bright">전체 글</h3>
          <Search />
        </div>
        <div className="flex w-full overflow-x-scroll hide-scrollbar gap-2 px-3">
          <TabButton content="KIDP 글로벌 디자인 인턴십" />
          <TabButton content="JavaScript" />
          <TabButton content="KIDP 글로벌 디자인 인턴십" />
          <TabButton content="KIDP 글로벌 디자인 인턴십" />
        </div>
        <ul className="flex flex-col gap-4 pt-8 w-full">
          {posts.map((post) => (
            <div key={post.slug}>
              <SidebarContent post={post} />
              <hr className=" my-4 text-bg-subtle" />
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
}
