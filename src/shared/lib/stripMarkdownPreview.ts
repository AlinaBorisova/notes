export function stripMarkdownForPreview(text: string): string {
  if (!text) return '';
  let s = text.trim();

  s = s.replace(/^#{1,6}\s+/, '');
  s = s.replace(/^>\s*/, '');
  s = s.replace(/^\s*[-*+]\s+/, '');

  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  for (let i = 0; i < 4; i++) {
    const next = s
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/~~(.+?)~~/g, '$1');
    if (next === s) break;
    s = next;
  }

  s = s.replace(/`([^`]+)`/g, '$1');

  s = s.replace(/\*([^*\n]+)\*/g, '$1');
  s = s.replace(/_([^_\n]+)_/g, '$1');

  s = s.replace(/\*\*/g, '');
  s = s.replace(/`/g, '');

  return s.replace(/\s+/g, ' ').trim();
}
