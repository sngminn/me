import { Sidebar } from '@/src/components/layout/Sidebar';
import AsciiVideo from '@/src/components/ui/AsciiVideo';
import { getAllPosts } from '@/src/lib/obsidian/post';

function HeroSection() {
  return (
    <div className="flex flex-col h-[70vh] w-full justify-end items-start gap-0 fixed top-0 ">
      <AsciiVideo className="absolute top-0 -right-[250px]" />
      <div className="flex flex-col gap-6 p-8">
        <h1 className='text-primary-bg text-4xl whitespace-nowrap font-extrabold font-["SUITE"]'>
          {`<프론트엔드 />개발자`}
          <br />
          {`{김승민}입니다_`}
        </h1>
        <span className="text-primary-bg">개발, 디자인 이것저것 만듭니다</span>
      </div>
    </div>
  );
}

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary-main">
      <HeroSection />
      <Sidebar posts={allPosts} className="mt-[70vh] z-10" />
    </div>
  );
}
