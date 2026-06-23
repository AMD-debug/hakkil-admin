import { ImagePlus, X } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import { cldThumb } from '../../lib/cloudinary';

interface Props {
  value: string;
  folder?: string;
  /** Ratio de recadrage imposé (ex. 1 = carré, 16/9 = bannière). */
  aspectRatio?: number;
  onChange: (url: string) => void;
}

/** Sélecteur d'image unique (ex. couverture d'article, photo de membre). */
export function ImagePicker({
  value,
  folder = 'misc',
  aspectRatio,
  onChange,
}: Props) {
  const { ready, open } = useCloudinaryUpload(folder, {
    cropping: true,
    aspectRatio,
    multiple: false,
  });

  if (value) {
    return (
      <div className="group relative h-32 w-48 overflow-hidden rounded-lg border border-gray-200">
        <img
          src={cldThumb(value, 384)}
          alt=""
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          title="Retirer"
          onClick={() => onChange('')}
          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open((url) => onChange(url))}
      disabled={!ready}
      className="flex h-32 w-48 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
    >
      <ImagePlus size={22} />
      <span className="text-xs">{ready ? 'Choisir une image' : '…'}</span>
    </button>
  );
}
