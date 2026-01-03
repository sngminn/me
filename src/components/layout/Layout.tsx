'use client';

import { type ReactNode, useState } from 'react';
import GNB from '../ui/GNB';
import GNBMenu from '../ui/GNBMenu';

export default function Layout({ children }: { children: ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);
  function handleMenuClick() {
    setShowMenu((prev) => !prev);
  }
  return (
    <>
      <div className="fixed w-full top-0 max-w-[1080px] mx-auto z-200">
        {showMenu && <GNBMenu menuHandler={handleMenuClick} />}
        <GNB menuHandler={handleMenuClick} />
      </div>
      <div className="mt-7">{children}</div>
    </>
  );
}
