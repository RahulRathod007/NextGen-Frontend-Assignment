import { Product } from './api';

const ADDED_KEY = 'localAddedProducts';
const UPDATES_KEY = 'localProductUpdates';
const DELETED_KEY = 'localDeletedProductIds';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** DummyJSON does not persist CRUD — we overlay changes in localStorage for the session. */
export const localProductStore = {
  getAdded(): Product[] {
    return readJson<Product[]>(ADDED_KEY, []);
  },

  add(product: Product) {
    const list = localProductStore.getAdded();
    writeJson(ADDED_KEY, [product, ...list.filter((p) => p.id !== product.id)]);
  },

  getUpdates(): Record<string, Partial<Product>> {
    return readJson<Record<string, Partial<Product>>>(UPDATES_KEY, {});
  },

  update(id: number, patch: Partial<Product>) {
    const updates = localProductStore.getUpdates();
    updates[String(id)] = { ...updates[String(id)], ...patch, id };
    writeJson(UPDATES_KEY, updates);

    const added = localProductStore.getAdded().map((p) =>
      p.id === id ? { ...p, ...patch } : p
    );
    writeJson(ADDED_KEY, added);
  },

  getDeletedIds(): number[] {
    return readJson<number[]>(DELETED_KEY, []);
  },

  remove(id: number) {
    const deleted = new Set(localProductStore.getDeletedIds());
    deleted.add(id);
    writeJson(DELETED_KEY, Array.from(deleted));
    writeJson(
      ADDED_KEY,
      localProductStore.getAdded().filter((p) => p.id !== id)
    );
  },

  /** Merge API page with local adds/edits/deletes. */
  applyToList(
    apiProducts: Product[],
    opts?: { search?: string; category?: string; includeAdded?: boolean }
  ): Product[] {
    const deleted = new Set(localProductStore.getDeletedIds());
    const updates = localProductStore.getUpdates();
    const search = opts?.search?.toLowerCase().trim() || '';
    const category = opts?.category || '';

    const fromApi = apiProducts
      .filter((p) => !deleted.has(p.id))
      .map((p) => {
        const patch = updates[String(p.id)];
        return patch ? { ...p, ...patch } : p;
      });

    if (!opts?.includeAdded) return fromApi;

    let added = localProductStore.getAdded().filter((p) => !deleted.has(p.id));

    if (search) {
      added = added.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.category?.toLowerCase().includes(search)
      );
    } else if (category) {
      added = added.filter((p) => p.category === category);
    }

    const apiIds = new Set(fromApi.map((p) => p.id));
    const uniqueAdded = added.filter((p) => !apiIds.has(p.id));

    return [...uniqueAdded, ...fromApi];
  },

  matchingAddedCount(opts?: { search?: string; category?: string }) {
    const deleted = new Set(localProductStore.getDeletedIds());
    const search = opts?.search?.toLowerCase().trim() || '';
    const category = opts?.category || '';

    return localProductStore
      .getAdded()
      .filter((p) => !deleted.has(p.id))
      .filter((p) => {
        if (search) {
          return (
            p.title.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search) ||
            p.category?.toLowerCase().includes(search)
          );
        }
        if (category) return p.category === category;
        return true;
      }).length;
  },

  getById(id: number, apiProduct: Product | null): Product | null {
    const deleted = new Set(localProductStore.getDeletedIds());
    if (deleted.has(id)) return null;

    const added = localProductStore.getAdded().find((p) => p.id === id);
    if (added) return added;

    if (!apiProduct) return null;
    const patch = localProductStore.getUpdates()[String(id)];
    return patch ? { ...apiProduct, ...patch } : apiProduct;
  },
};
