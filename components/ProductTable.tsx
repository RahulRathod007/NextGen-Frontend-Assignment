'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';
import { formatCategoryLabel, formatPrice } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="panel overflow-hidden animate-fade-up">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-surface-elev bg-surface-soft/80 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-elev">
            {products.map((product) => (
              <tr key={product.id} className="group transition hover:bg-brand-mist/30">
                <td className="px-5 py-4">
                  <Link href={`/dashboard/products/${product.id}`} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-surface-elev ring-1 ring-surface-elev">
                      <Image
                        src={product.thumbnail || 'https://cdn.dummyjson.com/product-images/placeholder.png'}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <span className="max-w-[220px] truncate font-medium text-ink group-hover:text-brand">
                      {product.title}
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <span className="chip bg-surface-elev text-ink-soft">
                    {formatCategoryLabel(product.category)}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-ink">{formatPrice(product.price)}</td>
                <td className="px-5 py-4">
                  <span className="chip bg-accent-soft text-accent">{product.rating.toFixed(1)} ★</span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`font-semibold ${product.stock > 0 ? 'text-brand' : 'text-red-600'}`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-brand hover:text-brand-dark"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="text-ink-soft hover:text-ink"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
