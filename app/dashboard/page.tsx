'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { productApi, Product } from '@/lib/api';
import { localProductStore } from '@/lib/localStore';
import { parsePageSize, parsePositiveInt } from '@/lib/utils';
import ProductTable from '@/components/ProductTable';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import FilterSort from '@/components/FilterSort';
import ConfirmDialog from '@/components/ConfirmDialog';
import { EmptyState, ErrorBanner, Spinner } from '@/components/States';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePageSize(searchParams.get('pageSize'));
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  const requestIdRef = useRef(0);

  const updateUrl = useCallback(
    (patch: {
      page?: number;
      pageSize?: number;
      search?: string;
      category?: string;
      sort?: string;
    }) => {
      const params = new URLSearchParams();
      const nextPage = patch.page ?? page;
      const nextSize = patch.pageSize ?? pageSize;
      const nextSearch = patch.search !== undefined ? patch.search : search;
      const nextCategory = patch.category !== undefined ? patch.category : category;
      const nextSort = patch.sort !== undefined ? patch.sort : sort;

      params.set('page', String(nextPage));
      params.set('pageSize', String(nextSize));
      if (nextSearch) params.set('search', nextSearch);
      if (nextCategory) params.set('category', nextCategory);
      if (nextSort) params.set('sort', nextSort);

      router.push(`?${params.toString()}`);
    },
    [page, pageSize, search, category, sort, router]
  );

  useEffect(() => {
    productApi
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const skip = (page - 1) * pageSize;
        const config = { signal: controller.signal };

        let response;
        // DummyJSON cannot search + category together → choosing one clears the other in the UI.
        if (search) {
          response = await productApi.searchProducts(search, pageSize, skip, config);
        } else if (category) {
          response = await productApi.getProductsByCategory(category, pageSize, skip, config);
        } else {
          response = await productApi.getProducts(pageSize, skip, config);
        }

        if (requestId !== requestIdRef.current) return;

        let items = localProductStore.applyToList(response.data.products, {
          search,
          category: search ? '' : category,
          includeAdded: page === 1,
        });

        if (sort) {
          const [sortKey, sortOrder] = sort.split('-');
          items = [...items].sort((a, b) => {
            let aVal: string | number = a[sortKey as keyof Product] as string | number;
            let bVal: string | number = b[sortKey as keyof Product] as string | number;

            if (typeof aVal === 'string') {
              aVal = aVal.toLowerCase();
              bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
        }

        const apiTotal = response.data.total;
        const addedCount = localProductStore.matchingAddedCount({
          search,
          category: search ? '' : category,
        });
        const deletedCount = localProductStore.getDeletedIds().length;
        const mergedTotal = Math.max(0, apiTotal + addedCount - deletedCount);

        setProducts(items);
        setTotal(mergedTotal);
      } catch (err: unknown) {
        if (controller.signal.aborted || requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
        setTotal(0);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [page, pageSize, search, category, sort, retryKey]);

  // Clamp out-of-range pages like ?page=999 without breaking the UI
  useEffect(() => {
    if (loading || total === 0) return;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) {
      updateUrl({ page: totalPages });
    }
  }, [loading, total, page, pageSize, updateUrl]);

  const handleSearch = (value: string) => {
    // Search clears category (API cannot combine both)
    updateUrl({ page: 1, search: value, category: value ? '' : category });
  };

  const handleCategoryChange = (value: string) => {
    // Category clears search
    updateUrl({ page: 1, category: value, search: '' });
  };

  const confirmDelete = async () => {
    if (deleteId == null || deleting) return;
    setDeleting(true);
    try {
      await productApi.deleteProduct(deleteId);
      localProductStore.remove(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setTotal((t) => Math.max(0, t - 1));
      setDeleteId(null);
    } catch {
      // Still reflect delete locally — DummyJSON does not persist deletes
      localProductStore.remove(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setTotal((t) => Math.max(0, t - 1));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Catalog</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink md:text-4xl">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">Browse, search, filter and manage inventory.</p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          + Add product
        </Link>
      </div>

      <div className="panel space-y-4 p-4 md:p-5">
        <Search value={search} onChange={handleSearch} />
        <FilterSort
          categories={categories}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          sortBy={sort}
          onSortChange={(value) => updateUrl({ sort: value })}
          searchActive={!!search}
        />
      </div>

      {error && (
        <ErrorBanner
          message={error}
          onRetry={() => setRetryKey((k) => k + 1)}
          onDismiss={() => setError('')}
        />
      )}

      {loading && <Spinner label="Loading products..." />}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="No products found"
          description="Try a different search, clear filters, or add a new product."
          actionLabel="Clear filters"
          onAction={() => updateUrl({ page: 1, search: '', category: '', sort: '' })}
        />
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="hidden md:block">
            <ProductTable products={products} onDelete={setDeleteId} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={setDeleteId} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(p) => updateUrl({ page: p })}
            onPageSizeChange={(size) => updateUrl({ page: 1, pageSize: size })}
          />
        </>
      )}

      <ConfirmDialog
        open={deleteId != null}
        title="Delete product?"
        message="This removes the product from your dashboard view. DummyJSON does not permanently delete it on the server."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-mist border-t-brand" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
