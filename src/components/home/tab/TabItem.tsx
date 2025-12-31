import type { MouseEventHandler } from 'react';

export default function TabItem({
  content,
  active = false,
  onClick,
}: {
  content: string;
  active?: boolean;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      type="button"
      className={`${active ? 'bg-white text-text-inverse' : 'bg-bg-subtle border-text-default text-text-subtle'} text-sm flex justify-center whitespace-nowrap items-center rounded-full px-3 py-1 font-medium cursor-pointer`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
