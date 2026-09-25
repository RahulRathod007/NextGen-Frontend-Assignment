import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Safe positive int from URL (rejects NaN, negatives, decimals). */
export function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  if (value == null || value === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  const int = Math.floor(n);
  if (max != null && int > max) return max;
  return int;
}

export function parsePageSize(value: string | null): number {
  const allowed = [10, 20, 50];
  const n = Number(value);
  return allowed.includes(n) ? n : 10;
}

export function formatCategoryLabel(category: string) {
  return category
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}
