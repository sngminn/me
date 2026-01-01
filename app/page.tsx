import HomeClient from '@/src/components/home/HomeClient';
import { getAllPosts } from '@/src/lib/obsidian/post';

export default function Home() {
  const allPosts = getAllPosts();

  return <HomeClient posts={allPosts} />;
}
