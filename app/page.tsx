import { ArrowRight } from 'lucide-react';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { getAllPosts } from '@/src/lib/obsidian/post';

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary-main font-sans">
      <h1 className='text-primary-bg text-4xl font-extrabold font-["SUITE"] leading-10 '>
        프론트엔드 개발자
        <br />
        김승민입니다_
      </h1>
      <span>개발, 디자인 이것저것 만듭니다</span>
      <button
        type="button"
        className="text-base flex justify-center items-center bg-white rounded-full border-2 border-primary-bg text-text-inverse px-4 py-1 font-semibold"
      >
        JavaScript <ArrowRight size={16} />
      </button>
      <Sidebar posts={allPosts} />
    </div>
  );
}
