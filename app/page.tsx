import { redirect } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';
import { getAllPosts } from '@/src/lib/obsidian/post';

export default function Home() {
  // TODO: 나중에 수정
  redirect('/posts/250926-JS-Memory-management');
  const posts = getAllPosts();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <ModeToggle />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        안녕하세요
      </main>
    </div>
  );
}
