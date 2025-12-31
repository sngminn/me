import type { Dispatch, SetStateAction } from 'react';
import TabItem from './TabItem';
export default function TabContainer({
  activeTab,
  setActiveTab,
  tags,
}: {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  tags: Set<string>;
}) {
  return (
    <div className="flex w-full overflow-x-scroll hide-scrollbar gap-2 px-3 py-4 mt-4">
      <TabItem content="모든 글" active={!activeTab} onClick={() => setActiveTab('')} />
      {[...tags].map((tag) => (
        <TabItem
          key={tag}
          content={tag}
          active={activeTab === tag}
          onClick={() => setActiveTab(tag)}
        />
      ))}
    </div>
  );
}
