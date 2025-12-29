export function Tag({ text }: { text: string }) {
  return (
    <div className="flex items-center">
      <div className="text-[#FFC908] bg-[#282000] rounded-l-full pl-3 pr-2 py-1 text-[11px] font-medium  uppercase leading-none">
        {text}
      </div>
      <div className="w-2.5">
        <svg
          viewBox="0 0 10 20"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="#282000"
          stroke="#FFC908"
        >
          <path d="M0 0 L10 10 L0 20" />
        </svg>
      </div>
    </div>
  );
}
