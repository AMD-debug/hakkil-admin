/**
 * Génère un slug URL-safe à partir d'un texte (titre FR en général).
 * Cf. docs/CLAUDE.md (conventions de nommage Firestore).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // retire les accents (diacritiques combinants)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
