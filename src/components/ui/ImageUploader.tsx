import { ImagePlus, Star, X } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import { cldThumb } from '../../lib/cloudinary';

interface Props {
  images: string[];
  coverImage: string;
  folder?: string;
  /** Ratio de recadrage imposé (optionnel : libre par défaut). */
  aspectRatio?: number;
  onChange: (images: string[], coverImage: string) => void;
}

export function ImageUploader({
  images,
  coverImage,
  folder = 'misc',
  aspectRatio,
  onChange,
}: Props) {
  const { ready, open } = useCloudinaryUpload(folder, {
    cropping: true,
    aspectRatio,
  });

  function handleAdd() {
    open((url) => {
      const next = [...images, url];
      onChange(next, coverImage || url);
    });
  }

  function remove(url: string) {
    const next = images.filter((i) => i !== url);
    const cover = coverImage === url ? (next[0] ?? '') : coverImage;
    onChange(next, cover);
  }

  function setCover(url: string) {
    onChange(images, url);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div
            key={url}
            className={`group relative h-24 w-24 overflow-hidden rounded-lg border-2 ${
              url === coverImage ? 'border-brand' : 'border-transparent'
            }`}
          >
            <img
              src={cldThumb(url, 192)}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              title="Supprimer"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={12} />
            </button>
            <button
              type="button"
              title="Définir comme couverture"
              onClick={() => setCover(url)}
              className={`absolute bottom-1 left-1 rounded-full p-1 ${
                url === coverImage
                  ? 'bg-brand text-white'
                  : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
              }`}
            >
              <Star size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!ready}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
        >
          <ImagePlus size={20} />
          <span className="text-xs">{ready ? 'Ajouter' : '…'}</span>
        </button>
      </div>
      {coverImage && (
        <p className="text-xs text-body">
          <Star size={12} className="mr-1 inline text-brand" />
          L'étoile indique l'image de couverture.
        </p>
      )}
    </div>
  );
}
