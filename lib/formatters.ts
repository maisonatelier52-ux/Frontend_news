export function formatReadTime(val?: any): string {
  if (!val && val !== 0) return '5 min read';
  const str = String(val).trim();
  if (!str) return '5 min read';
  if (/^\d+$/.test(str)) {
    return `${str} min read`;
  }
  const lower = str.toLowerCase();
  if (lower.includes('min')) {
    if (lower.includes('read')) {
      return str;
    }
    return `${str} read`;
  }
  return `${str} min read`;
}
