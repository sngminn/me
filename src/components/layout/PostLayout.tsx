import type { ReactNode } from 'react';

interface PostLayoutProps {
  children: ReactNode;
}
export function PostLayout({ children }: PostLayoutProps) {
  return (
    <div className="flex gap-6 w-full">
      <main className="w-full flex justify-center items-center pt-[40vh] pb-64 ml-[380px]">
        {children}
      </main>
    </div>
  );
}
