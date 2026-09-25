'use client';

import { formatCategoryLabel } from '@/lib/utils';

interface FilterSortProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchActive?: boolean;
}

export default function FilterSort({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchActive,
}: FilterSortProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="flex-1">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="field"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategoryLabel(cat)}
            </option>
          ))}
        </select>
        {searchActive && (
          <p className="mt-1.5 text-xs text-ink-muted">
            Search is active — category filter is cleared because DummyJSON cannot search and filter together.
          </p>
        )}
      </div>

      <div className="md:w-56">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="field"
          aria-label="Sort products"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating-asc">Rating: Low → High</option>
          <option value="rating-desc">Rating: High → Low</option>
          <option value="title-asc">Title: A → Z</option>
          <option value="title-desc">Title: Z → A</option>
        </select>
      </div>
    </div>
  );
}
