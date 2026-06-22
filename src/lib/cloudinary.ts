export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
export const UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Injecte des transformations dans une URL de livraison Cloudinary
 * (insérées juste après `/upload/`). On stocke toujours l'URL complète en base ;
 * ce helper sert à demander une version optimisée/redimensionnée à l'affichage.
 *
 * Ex : cldUrl(url, 'f_auto,q_auto,w_400') →
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_400/v123/...
 */
export function cldUrl(url: string, transform: string): string {
  if (!url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
}

/** Vignette carrée optimisée (WebP auto). */
export function cldThumb(url: string, size = 200): string {
  return cldUrl(url, `f_auto,q_auto,c_fill,w_${size},h_${size}`);
}
