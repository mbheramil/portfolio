// Shared template helpers. Content comes from content.json (edited through the
// admin panel), so it's treated as untrusted when interpolated into markup.

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  } as Record<string, string>)[c]!);
}

export function escapeAttr(s: string): string { return escapeHtml(s); }

// True for a value that's a real link — '#' placeholders count as empty.
export function hasLink(v: string | undefined | null): boolean {
  if (!v) return false;
  const t = v.trim();
  return t.length > 0 && t !== '#';
}

// Builds a background declaration from a content value: '#hex' → flat colour,
// anything else → image URL. Quotes and parens are stripped so a stray value
// can't break out of the style attribute.
export function coverBg(v: string | undefined | null): string {
  const safe = (v || '').trim().replace(/["'()\\]/g, '');
  if (!safe) return '';
  return safe.startsWith('#')
    ? `background:${safe}`
    : `background:url('${safe}') center/cover no-repeat`;
}
