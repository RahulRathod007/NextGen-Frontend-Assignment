'use client';

export function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 animate-fade-up">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand-mist" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand" />
      </div>
      <p className="text-sm font-medium text-ink-muted">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="panel flex flex-col items-center px-6 py-16 text-center animate-fade-up">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
      <p className="text-sm font-medium">{message}</p>
      <div className="flex gap-2">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 text-xs">
            Retry
          </button>
        )}
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="btn-ghost px-3 py-1.5 text-xs text-red-700">
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
