import { slugify } from '@/src/lib/utils/slugify';
import { getAllPosts } from './post';
import type { GraphData, GraphLink, GraphNode } from './types';

export function getGraphData(): GraphData {
  const posts = getAllPosts();
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Map to check existence and get exact slug casing
  // Key: lowercase slug, Value: actual slug
  const slugMap = new Map<string, string>();
  posts.forEach((p) => slugMap.set(p.slug.toLowerCase(), p.slug));
  const addedGhosts = new Set<string>(); // Track added ghost nodes

  // 1. Create Nodes
  posts.forEach((post) => {
    nodes.push({
      id: post.slug,
      name: post.title,
      val: 1, // Initial size
    });
  });

  // 2. Create Links
  posts.forEach((post) => {
    // Match [[link]] or [[link|text]]
    const regex = /\[\[(.*?)\]\]/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(post.content)) !== null) {
      let linkTarget = match[1];

      // Handle alias [[Target|Alias]]
      if (linkTarget.includes('|')) {
        linkTarget = linkTarget.split('|')[0];
      }

      // Clean up (trim)
      linkTarget = linkTarget.trim();

      // Find matching slug (case-insensitive)
      let targetSlug = slugMap.get(linkTarget.toLowerCase());

      // If target doesn't exist, create a ghost node
      if (!targetSlug) {
        targetSlug = slugify(linkTarget); // Simple slugify

        // Add ghost node if not already added
        if (!addedGhosts.has(targetSlug)) {
          nodes.push({
            id: targetSlug,
            name: linkTarget,
            val: 0.5, // Smaller size for ghost nodes
          });
          // Update map to avoid duplicates
          slugMap.set(linkTarget.toLowerCase(), targetSlug);
          addedGhosts.add(targetSlug);
        }
      }

      links.push({
        source: post.slug,
        target: targetSlug,
      });
    }
  });

  // 3. Calculate Node Sizes (Centrality)
  const connectionCount: Record<string, number> = {};
  links.forEach((link) => {
    connectionCount[link.source] = (connectionCount[link.source] || 0) + 1;
    connectionCount[link.target] = (connectionCount[link.target] || 0) + 1;
  });

  nodes.forEach((node) => {
    if (connectionCount[node.id]) {
      // Ghost nodes start at 0.5, real nodes at 1
      const baseVal = node.val;
      node.val = baseVal + connectionCount[node.id] * 0.5;
    }
  });

  return { nodes, links };
}
