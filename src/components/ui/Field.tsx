import type { ReactNode } from 'react';

interface Props {
  label: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, error, children, htmlFor }: Props) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand';
