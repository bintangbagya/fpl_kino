/**
 * Generates a clean, readable, URL-safe slug from an article title.
 * Removes emojis, special symbols, punctuation, and trims length.
 *
 * Example:
 * Title: "🏆 Manager of the Month — Agustus 2026: Fandy Pratomo Bersinar Paling Konsisten!"
 * Slug: "manager-of-the-month-agustus-2026-fandy-pratomo"
 */
export function slugifyTitle(title: string): string {
  if (!title) return 'article';

  let clean = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^\w\s-]/g, '')        // remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')            // replace spaces with hyphens
    .replace(/-+/g, '-')             // remove duplicate hyphens
    .replace(/^-|-$/g, '');          // trim hyphens from start and end

  const words = clean.split('-').filter(Boolean);
  if (words.length > 7) {
    clean = words.slice(0, 7).join('-');
  }

  return clean || 'article';
}

/**
 * Returns the clean, public canonical URL for a newsletter article.
 * Example: https://fplkinodev.vercel.app/newsletter/manager-of-the-month-agustus-2026-fandy-pratomo
 */
export function getArticlePublicUrl(title: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fplkinodev.vercel.app';
  const slug = slugifyTitle(title);
  return `${origin}/newsletter/${slug}`;
}
