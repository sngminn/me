import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { slugify } from '@/src/lib/utils/slugify';
import type { Post } from './types';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '').toLowerCase();

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const match = content.match(/!\[\[(.*?)(?:\|.*?)?\]\]/) || '';
      const thumbnailVal = match ? match[1].split('/').pop()?.replace(/\s+/g, '-') : undefined;
      const thumbnail = thumbnailVal ? `/api/obsidian-images/${thumbnailVal}` : undefined;

      return {
        thumbnail,
        slug,
        title: data.title || slug,
        date: data.date || '',
        tags: data.tags || [],
        content,
        excerpt: data.excerpt || '',
      } as Post;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const targetSlug = slug.toLowerCase();

    const fileNames = fs.readdirSync(postsDirectory);
    const matchedFileName = fileNames.find(
      (fileName) => fileName.replace(/\.md$/, '').toLowerCase() === targetSlug
    );

    if (!matchedFileName) {
      return null;
    }

    const fullPath = path.join(postsDirectory, matchedFileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const match = content.match(/!\[\[(.*?)(?:\|.*?)?\]\]/) || '';
    const thumbnailVal = match ? match[1].split('/').pop()?.replace(/\s+/g, '-') : undefined;
    const thumbnail = thumbnailVal ? `/api/obsidian-images/${thumbnailVal}` : undefined;

    // 0. Obsidian 이미지 ![[image.png]] -> 일반 마크다운 이미지 ![image.png](/api/obsidian-images/image.png)로 변환
    let processedContent = content.replace(/!\[\[(.*?)(?:\|.*?)?\]\]/g, (_, p1) => {
      // 경로가 포함된 경우("../files/img.png") 파일명만 추출
      const fileName = p1.split('/').pop();
      // 공백을 -로 치환 (sync-assets.mjs 로직과 통일)
      const safeFileName = fileName.replace(/\s+/g, '-');
      // alt 텍스트에는 공백 유지, URL에만 하이픈 적용
      return `![${fileName}](/api/obsidian-images/${safeFileName})`;
    });

    // 1. Obsidian 링크 [[link]] -> 일반 마크다운 링크 [link](/posts/link)로 변환
    processedContent = processedContent.replace(/\[\[(.*?)\]\]/g, (_, p1) => {
      let linkTarget = p1;
      let linkText = p1;

      // Handle alias [[Target|Alias]]
      if (p1.includes('|')) {
        const parts = p1.split('|');
        linkTarget = parts[0];
        linkText = parts[1];
      }

      const targetSlug = slugify(linkTarget);
      return `[${linkText}](/posts/${targetSlug})`;
    });

    return {
      thumbnail,
      slug: targetSlug,
      title: data.title || targetSlug,
      date: data.date || '',
      tags: data.tags || [],
      content: processedContent,
      excerpt: data.excerpt || '',
    } as Post;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`get post error ${slug}:`, e);
    }
    return null;
  }
}
