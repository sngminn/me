'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, type ReactNode, use, useCallback, useEffect, useRef } from 'react';

const ViewTransitionContext = createContext<((href: string) => void) | null>(null);

export function ViewTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Ref to store the resolve function of the promise that waits for page load
  const finishViewTransition = useRef<(() => void) | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // When pathname changes, if there is a pending transition, resolve it.
    if (finishViewTransition.current) {
      finishViewTransition.current();
      finishViewTransition.current = null;
    }
  }, [pathname]);

  const triggerTransition = useCallback(
    (href: string) => {
      // Fallback if browser doesn't support View Transitions
      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      // Start variable transition
      document.startViewTransition(() => {
        router.push(href);

        // Return a promise that resolves when the useEffect above fires (route change complete)
        return new Promise<void>((resolve) => {
          finishViewTransition.current = resolve;
        });
      });
    },
    [router]
  );

  return (
    <ViewTransitionContext.Provider value={triggerTransition}>
      {children}
    </ViewTransitionContext.Provider>
  );
}

export function useViewTransition() {
  return use(ViewTransitionContext);
}
