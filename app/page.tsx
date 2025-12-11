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
      <Sidebar posts={allPosts} />
    </div>
  );
}
