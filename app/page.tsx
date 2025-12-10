import { Sidebar } from '@/src/components/layout/Sidebar';
import { getAllPosts } from '@/src/lib/obsidian/post';

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <Sidebar posts={allPosts} />
    </div>
  );
}
