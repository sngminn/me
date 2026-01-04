import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import Content from '@/src/components/posts/Content';
import { getAllPosts, getPostBySlug } from '@/src/lib/obsidian/post';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // 커스텀 테마 로드
  const themePath = path.join(process.cwd(), 'docs/HTVODP-color-theme.json');
  const customTheme = JSON.parse(fs.readFileSync(themePath, 'utf8'));

  return (
    <div className="h-hull w-full bg-bg-default">
      <Content post={post}>
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: customTheme,
                    keepBackground: true,
                  },
                ],
              ],
            },
          }}
        />
      </Content>
    </div>
  );
}
