import Image from 'next/image';
import Link from 'next/link';
import { Tag } from '@/src/components/ui/Tag';
import type { Post } from '@/src/lib/obsidian/types';
import { relativeDate } from '@/src/lib/utils/day';

export default function CarouselItem({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <li className="w-[80vw] flex flex-col px-4 py-4 rounded-2xl">
        <div className="flex flex-col gap-2 justify-center items-center">
          {post.tags[0] && <Tag text={post.tags[0]} />}
          <h4
            className={`text-text-highlight text-center leading-[125%] break-keep font-semibold text-[18px]`}
          >
            {post.title}
          </h4>
          <span className="text-[12px] font-medium">{relativeDate(post.date)}</span>
        </div>
        <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden">
          <Image
            src={post.thumbnail || '/thumbnail-fallback.jpg'}
            fill
            alt={`${post.title} 썸네일`}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </li>
    </Link>
  );
}
