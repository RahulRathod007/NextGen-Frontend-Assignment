'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ProductPayload } from '@/lib/api';
import { formatCategoryLabel } from '@/lib/utils';

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  discountPercentage?: number;
  thumbnail?: string;
}

interface ProductFormProps {
  initialValues: ProductFormValues;
  categories: string[];
  submitLabel: string;
  cancelHref: string;
  onSubmit: (values: ProductPayload) => Promise<void>;
  note?: string;
}

export default function ProductForm({
  initialValues,
  categories,
  submitLabel,
  cancelHref,
  onSubmit,
  note,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const next: Partial<Record<keyof ProductFormValues, string>> = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    if (!(form.price > 0)) next.price = 'Price must be greater than 0';
    if (form.stock < 0 || Number.isNaN(form.stock)) next.stock = 'Stock cannot be negative';
    if (!form.category) next.category = 'Category is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price,
        stock: form.stock,
        category: form.category,
        discountPercentage: form.discountPercentage || 0,
        thumbnail: form.thumbnail || undefined,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="panel p-6 md:p-8 animate-fade-up">
      {error && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="label">
            Title *
          </label>
          <input
            id="title"
            className="field"
            value={form.title}
            disabled={submitting}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            className="field"
            value={form.description}
            disabled={submitting}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">
              Price *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="field"
              value={form.price}
              disabled={submitting}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="stock" className="label">
              Stock *
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              className="field"
              value={form.stock}
              disabled={submitting}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value, 10) || 0 })}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">
              Category *
            </label>
            <select
              id="category"
              className="field"
              value={form.category}
              disabled={submitting}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryLabel(cat)}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="discount" className="label">
              Discount %
            </label>
            <input
              id="discount"
              type="number"
              min="0"
              max="100"
              className="field"
              value={form.discountPercentage || 0}
              disabled={submitting}
              onChange={(e) =>
                setForm({ ...form, discountPercentage: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <div>
          <label htmlFor="thumbnail" className="label">
            Thumbnail URL
          </label>
          <input
            id="thumbnail"
            type="url"
            className="field"
            placeholder="https://..."
            value={form.thumbnail || ''}
            disabled={submitting}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Saving...' : submitLabel}
          </button>
          <Link href={cancelHref} className="btn-secondary flex-1 text-center">
            Cancel
          </Link>
        </div>
      </form>

      {note && (
        <p className="mt-6 rounded-xl border border-brand-mist bg-brand-mist/50 px-4 py-3 text-sm text-brand-dark">
          {note}
        </p>
      )}
    </div>
  );
}
