export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';

  return (
    markdown
      // 1. Remove YAML frontmatter (if it exists in the content string)
      .replace(/---[\s\S]*?---/, '')

      // 2. Obsidian WikiLinks
      .replace(/\[\[.*?\|(.*?)\]\]/g, '$1') // [[Link|Text]] -> Text
      .replace(/\[\[(.*?)\]\]/g, '$1') // [[Link]] -> Link

      // 3. Standard Markdown Links & Images
      .replace(/!\[(.*?)\]\(.*?\)/g, '') // Images -> Remove
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links -> Text

      // 4. Headers
      .replace(/#{1,6}\s+(.*)/g, '$1') // # Header -> Header

      // 5. Emphasis (Bold, Italic)
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // **Bold** -> Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // *Italic* -> Italic

      // 6. Code Blocks & Inline Code
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks -> Remove content
      .replace(/`(.+?)`/g, '$1') // Inline code -> Code

      // 7. Blockquotes
      .replace(/>\s+(.*)/g, '$1') // > Quote -> Quote

      // 8. Trim whitespace and newlines
      .replace(/\s+/g, ' ') // Multiple spaces/newlines -> Single space
      .trim()
  );
}
