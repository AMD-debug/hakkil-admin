import { useCallback, useEffect, useState } from 'react';
import { CLOUD_NAME, UPLOAD_PRESET } from '../lib/cloudinary';

const SCRIPT_SRC = 'https://upload-widget.cloudinary.com/latest/global/all.js';

interface UploadOptions {
  /** Active l'étape de recadrage du widget. */
  cropping?: boolean;
  /** Ratio imposé au recadrage (ex. 1 = carré, 16/9 = bannière). */
  aspectRatio?: number;
  /** Autorise plusieurs fichiers (défaut : true). */
  multiple?: boolean;
}

/**
 * Charge (une fois) le script du widget Cloudinary et expose `open()`.
 * Upload NON signé via un upload preset unsigned (plan Spark : pas de backend
 * pour signer). Chaque image uploadée déclenche `onUpload(secure_url)`.
 *
 * `cropping` active l'étape de recadrage intégrée du widget : l'image est
 * stockée déjà recadrée (ce qui apparaîtra sur le site).
 */
export function useCloudinaryUpload(
  folder = 'misc',
  options: UploadOptions = {},
) {
  const { cropping = false, aspectRatio, multiple = true } = options;
  const [ready, setReady] = useState<boolean>(
    () => typeof window !== 'undefined' && Boolean(window.cloudinary),
  );

  useEffect(() => {
    // Déjà disponible : `ready` a été initialisé à true.
    if (window.cloudinary) return;
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => setReady(true));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  const open = useCallback(
    (onUpload: (url: string) => void) => {
      if (!window.cloudinary) return;
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          multiple,
          folder,
          sources: ['local', 'url', 'camera'],
          ...(cropping
            ? {
                cropping: true,
                croppingAspectRatio: aspectRatio,
                croppingShowDimensions: true,
                showSkipCropButton: true,
              }
            : {}),
        },
        (error, result) => {
          if (!error && result?.event === 'success') {
            const url = result.info?.secure_url;
            if (url) onUpload(url);
          }
        },
      );
      widget.open();
    },
    [folder, cropping, aspectRatio, multiple],
  );

  return { ready, open };
}
