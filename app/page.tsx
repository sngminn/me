import Image from 'next/image';
import { PostLayout } from '@/src/components/layout/PostLayout';
import { getAllPosts } from '@/src/lib/obsidian/post';

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <PostLayout allPosts={allPosts}>
        <Image
          src="/lineDrawing.png"
          fill
          aria-hidden={true}
          alt="line drawing"
          className="pointer-events-none -z-10"
        />
      </PostLayout>
    </div>
  );
}
