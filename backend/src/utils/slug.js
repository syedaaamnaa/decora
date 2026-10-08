/**
 * Shared slug helpers used by models that auto-generate slugs (Project, Product, Service).
 */

/** Convert arbitrary text into a url-friendly slug. */
export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Ensure a slug is unique for the given model by appending -2, -3, ... as needed.
 * `excludeId` lets updates keep their own slug.
 */
export async function ensureUniqueSlug(Model, baseSlug, excludeId = null) {
  let slug = baseSlug || 'item';
  let attempt = 1;

  // Bounded loop so a pathological case can never spin forever.
  while (attempt <= 100) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return slug;

    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return `${baseSlug}-${Date.now()}`;
}
