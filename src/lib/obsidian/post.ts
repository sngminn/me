import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
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
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
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
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Transform WikiLinks [[link]] -> [link](/posts/link)
    const processedContent = content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
      let linkTarget = p1;
      let linkText = p1;

      // Handle alias [[Target|Alias]]
      if (p1.includes('|')) {
        const parts = p1.split('|');
        linkTarget = parts[0];
        linkText = parts[1];
      }

      const targetSlug = linkTarget.trim().replace(/\s+/g, '-').toLowerCase();
      return `[${linkText}](/posts/${targetSlug})`;
    });

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      tags: data.tags || [],
      content: processedContent,
      excerpt: data.excerpt || '',
    } as Post;
  } catch (_) {
    return null;
  }
}
