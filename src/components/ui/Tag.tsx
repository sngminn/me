export function Tag({ text, color }: { text: string; color: string }) {
  const primary = `oklch(from ${color} 0.9 0.34 h)`;
  const secondary = `oklch(from ${color} 0.5 0.1 h / 0.4)`;

  return (
    <div className="flex items-center">
      <div
        className="whitespace-nowrap rounded-l-full py-1 pr-2 pl-3 font-medium text-[11px] uppercase leading-none"
        style={{
          color: primary,
          backgroundColor: secondary,
        }}
      >
        {text.replaceAll('_', ' ')}
      </div>
      <div className="w-2.5">
        <svg
          viewBox="0 0 10 20"
          preserveAspectRatio="none"
          className="h-full w-full"
          stroke={primary}
          fill={secondary}
        >
          <path d="M0 0 L10 10 L0 20" />
        </svg>
      </div>
    </div>
  );
}
