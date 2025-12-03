export function slugify(text: string): string {
  return text.trim().replace(/\s+/g, '-').toLowerCase();
}
