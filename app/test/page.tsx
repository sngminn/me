import { getGraphData } from '@/lib/obsidian/graph';
import { getAllPosts } from '@/lib/obsidian/post';

export default function TestPage() {
  const posts = getAllPosts();
  const graphData = getGraphData();

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">Obsidian Pipeline Test</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Posts ({posts.length})</h2>
          <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto h-[500px]">
            {JSON.stringify(posts, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Graph Data</h2>
          <div className="mb-2">
            Nodes: {graphData.nodes.length}, Links: {graphData.links.length}
          </div>
          <pre className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto h-[500px]">
            {JSON.stringify(graphData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
