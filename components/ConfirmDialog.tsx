'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-panel animate-fade-up">
        <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
