import { Star } from 'lucide-react';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

/** Note 1–5 étoiles. Interactif si `onChange` est fourni, sinon affichage seul. */
export function StarRating({ value, onChange, size = 20 }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <Star
            size={size}
            className={filled ? 'fill-brand text-brand' : 'text-gray-300'}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            title={`${n} / 5`}
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
