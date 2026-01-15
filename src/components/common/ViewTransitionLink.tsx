'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useCallback } from 'react';
import { useViewTransition } from './ViewTransitionContext';

interface Props extends LinkProps {
  children: ReactNode;
  className?: string;
}

export default function ViewTransitionLink({ children, href, ...props }: Props) {
  const router = useRouter();
  const triggerTransition = useViewTransition();

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (triggerTransition) {
        triggerTransition(href.toString());
      } else {
        router.push(href.toString());
      }
    },
    [href, router, triggerTransition]
  );

  return (
    <Link href={href} {...props} onClick={handleLinkClick}>
      {children}
    </Link>
  );
}
