'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { productApi, Product } from '@/lib/api';
import { localProductStore } from '@/lib/localStore';
import { formatCategoryLabel, formatPrice } from '@/lib/utils';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ErrorBanner, Spinner } from '@/components/States';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!Number.isFinite(id) || id < 1) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setNotFound(false);

    try {
      const localOnly = localProductStore.getAdded().find((p) => p.id === id);
      if (localOnly) {
        setProduct(localOnly);
        return;
      }

      const { data } = await productApi.getProductById(id);
      const merged = localProductStore.getById(id, data);
      if (!merged) {
        setNotFound(true);
        setProduct(null);
      } else {
        setProduct(merged);
      }
    } catch {
      const merged = localProductStore.getById(id, null);
      if (merged) {
        setProduct(merged);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await productApi.deleteProduct(id);
    } catch {
      // ignore — still remove locally
    }
    localProductStore.remove(id);
    router.push('/dashboard');
  };

  if (loading) return <Spinner label="Loading product..." />;

  if (notFound || !product) {
    return (
      <div className="panel mx-auto max-w-lg px-6 py-16 text-center animate-fade-up">
        <h2 className="font-display text-2xl font-bold text-ink">Product not found</h2>
        <p className="mt-2 text-sm text-ink-muted">
          That product id does not exist, or it was removed from your local session.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6 inline-flex">
          Back to products
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onRetry={load} onDismiss={() => setError('')} />}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link href="/dashboard" className="text-sm font-semibold text-brand hover:text-brand-dark">
          ← Back to products
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/products/${product.id}/edit`} className="btn-primary">
            Edit
          </Link>
          <button type="button" onClick={() => setConfirmOpen(true)} className="btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="panel overflow-hidden animate-fade-up">
        <div className="grid gap-8 p-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative h-80 overflow-hidden rounded-2xl bg-surface-elev">
              <Image
                src={images[imageIndex] || product.thumbnail}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                      idx === imageIndex ? 'border-brand' : 'border-surface-elev'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="chip bg-brand-mist text-brand">
                {formatCategoryLabel(product.category)}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold text-ink">{product.title}</h1>
              <p className="mt-3 text-ink-muted">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-surface-soft p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Price</p>
                <p className="mt-1 text-2xl font-bold text-brand">{formatPrice(product.price)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Rating</p>
                <p className="mt-1 text-2xl font-bold text-ink">{product.rating.toFixed(1)} ★</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Stock</p>
                <p className={`mt-1 text-lg font-bold ${product.stock > 0 ? 'text-brand' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Discount</p>
                <p className="mt-1 text-lg font-bold text-accent">
                  {product.discountPercentage ? `${product.discountPercentage}%` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="panel p-6 animate-fade-up">
          <h2 className="font-display text-2xl font-bold text-ink">
            Reviews ({product.reviews.length})
          </h2>
          <div className="mt-5 space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border-b border-surface-elev pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{review.reviewerName}</p>
                    <p className="text-xs text-ink-muted">{review.reviewerEmail}</p>
                  </div>
                  <span className="chip bg-accent-soft text-accent">{review.rating} ★</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{review.comment}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this product?"
        message="It will disappear from your dashboard. DummyJSON does not permanently delete server data."
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
