'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';
import { formatCategoryLabel, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <article className="panel overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg animate-fade-up">
      <Link href={`/dashboard/products/${product.id}`} className="block">
        <div className="relative h-44 w-full bg-surface-elev">
          <Image
            src={product.thumbnail || 'https://cdn.dummyjson.com/product-images/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span className="absolute left-3 top-3 chip bg-white/90 text-ink-soft backdrop-blur">
            {formatCategoryLabel(product.category)}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink line-clamp-2">
            {product.title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-brand">{formatPrice(product.price)}</span>
            <span className="chip bg-accent-soft text-accent">{product.rating.toFixed(1)} ★</span>
          </div>
          <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-brand' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </Link>
      <div className="flex gap-2 border-t border-surface-elev px-4 py-3">
        <Link
          href={`/dashboard/products/${product.id}/edit`}
          className="btn-secondary flex-1 py-2 text-xs"
        >
          Edit
        </Link>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="btn-danger flex-1 py-2 text-xs"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
