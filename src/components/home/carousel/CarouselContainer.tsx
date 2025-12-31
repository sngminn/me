import type { Post } from '@/src/lib/obsidian/types';
import CarouselItem from './CarouselItem';

export default function CarouselContainer({ posts }: { posts: Post[] }) {
  return (
    <aside>
      <ul className="flex h-full gap-4 pt-4 overflow-scroll hide-scrollbar">
        {posts.map((post) => (
          <CarouselItem post={post} key={post.slug} />
        ))}
      </ul>
    </aside>
  );
}
