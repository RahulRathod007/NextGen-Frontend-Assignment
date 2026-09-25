'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productApi, Product } from '@/lib/api';
import { localProductStore } from '@/lib/localStore';
import ProductForm from '@/components/ProductForm';
import { Spinner } from '@/components/States';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!Number.isFinite(id) || id < 1) {
        setLoading(false);
        return;
      }

      try {
        const [categoriesRes, productRes] = await Promise.all([
          productApi.getCategories(),
          productApi.getProductById(id).catch(() => null),
        ]);

        setCategories(categoriesRes.data);
        const merged = localProductStore.getById(id, productRes?.data ?? null);
        setProduct(merged);
      } catch {
        setProduct(localProductStore.getById(id, null));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <Spinner label="Loading product..." />;

  if (!product) {
    return (
      <div className="panel mx-auto max-w-lg px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Product not found</h2>
        <Link href="/dashboard" className="btn-primary mt-6 inline-flex">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Edit product</h1>
          <p className="mt-1 text-sm text-ink-muted">Updates are kept in this session via localStorage.</p>
        </div>
        <Link
          href={`/dashboard/products/${id}`}
          className="text-sm font-semibold text-brand hover:underline"
        >
          Cancel
        </Link>
      </div>

      <ProductForm
        initialValues={{
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
        }}
        categories={categories}
        submitLabel="Save changes"
        cancelHref={`/dashboard/products/${id}`}
        note="DummyJSON update responses are temporary. We merge your edits into a local overlay so the UI stays correct after save."
        onSubmit={async (values) => {
          try {
            await productApi.updateProduct(id, values);
          } catch {
            // continue with local overlay
          }
          localProductStore.update(id, values);
          router.push(`/dashboard/products/${id}`);
        }}
      />
    </div>
  );
}
