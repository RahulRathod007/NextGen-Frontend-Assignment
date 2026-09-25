'use client';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) endPage = Math.min(5, totalPages);
  if (currentPage > totalPages - 3) startPage = Math.max(1, totalPages - 4);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="panel flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row">
      <p className="text-sm text-ink-muted">
        Showing <span className="font-semibold text-ink">{startItem}–{endItem}</span> of{' '}
        <span className="font-semibold text-ink">{total}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button type="button" onClick={() => onPageChange(1)} className="btn-secondary px-3 py-1.5 text-xs">
              1
            </button>
            {startPage > 2 && <span className="px-1 text-ink-muted">…</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition ${
              page === currentPage
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white border border-surface-elev text-ink-soft hover:bg-surface-soft'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-ink-muted">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          Next
        </button>
      </div>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="field w-auto py-1.5 text-xs"
        aria-label="Page size"
      >
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
        <option value={50}>50 / page</option>
      </select>
    </div>
  );
}
