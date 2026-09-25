'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productApi } from '@/lib/api';
import { localProductStore } from '@/lib/localStore';
import ProductForm from '@/components/ProductForm';
import { Spinner } from '@/components/States';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading form..." />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Add product</h1>
          <p className="mt-1 text-sm text-ink-muted">Create a catalog entry (session overlay).</p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-brand hover:underline">
          Cancel
        </Link>
      </div>

      <ProductForm
        initialValues={{
          title: '',
          description: '',
          price: 0,
          stock: 0,
          category: '',
          discountPercentage: 0,
          thumbnail: '',
        }}
        categories={categories}
        submitLabel="Create product"
        cancelHref="/dashboard"
        note="DummyJSON accepts create requests but does not persist them. We store the returned product in localStorage so it stays visible for this browser session."
        onSubmit={async (values) => {
          const { data } = await productApi.addProduct(values);
          const product = {
            ...data,
            ...values,
            id: data.id,
            rating: data.rating ?? 0,
            discountPercentage: values.discountPercentage ?? 0,
            thumbnail: values.thumbnail || data.thumbnail || '',
            images: data.images?.length ? data.images : values.thumbnail ? [values.thumbnail] : [],
          };
          localProductStore.add(product);
          router.push(`/dashboard/products/${product.id}`);
        }}
      />
    </div>
  );
}
