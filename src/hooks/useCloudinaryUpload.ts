import { useCallback, useEffect, useState } from 'react';
import { CLOUD_NAME, UPLOAD_PRESET } from '../lib/cloudinary';

const SCRIPT_SRC = 'https://upload-widget.cloudinary.com/latest/global/all.js';

/**
 * Charge (une fois) le script du widget Cloudinary et expose `open()`.
 * Upload NON signé via un upload preset unsigned (plan Spark : pas de backend
 * pour signer). Chaque image uploadée déclenche `onUpload(secure_url)`.
 */
export function useCloudinaryUpload(folder = 'misc') {
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
          multiple: true,
          folder,
          sources: ['local', 'url', 'camera'],
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
    [folder],
  );

  return { ready, open };
}
