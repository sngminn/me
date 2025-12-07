export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  excerpt?: string;
}

export interface GraphNode {
  id: string;
  name: string;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
