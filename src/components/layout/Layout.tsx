'use client';

import { useState } from 'react';
import GNB from '../ui/GNB';
import GNBMenu from '../ui/GNBMenu';

export default function Layout() {
  const [showMenu, setShowMenu] = useState(false);
  function handleMenuClick() {
    setShowMenu((prev) => !prev);
  }
  return (
    <div className="-translate-x-1/2 fixed top-0 left-1/2 z-200 flex w-full justify-center">
      {showMenu && <GNBMenu menuHandler={handleMenuClick} />}
      <GNB menuHandler={handleMenuClick} />
    </div>
  );
}
