import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import jellyfish from '@/public/jellyfish.png';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { getAllPosts } from '@/src/lib/obsidian/post';

function TabButton({ content }: { content: string }) {
  return (
    <button
      type="button"
      className="text-base flex justify-center items-center bg-white rounded-full border-2 border-primary-bg text-text-inverse px-4 py-1 font-semibold"
    >
      {content} <ArrowRight className="w-4" />
    </button>
  );
}

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary-main font-sans">
      <div className="flex flex-col h-[80vh] items-start justify-end pb-6 gap-12">
        <div>
          <div className="relative w-full">
            <Image src={jellyfish} alt="히어로 이미지" className="w-full h-auto" priority />
          </div>
          <h1 className='text-primary-bg text-4xl font-extrabold font-["SUITE"] leading-10 '>
            {`<프론트엔드 />개발자`}
            <br />
            {`{김승민}입니다_`}
          </h1>
          <span>개발, 디자인 이것저것 만듭니다</span>
        </div>
        <TabButton content="JavaScript" />
      </div>
      <Sidebar posts={allPosts} className="mt-32" />
    </div>
  );
}
