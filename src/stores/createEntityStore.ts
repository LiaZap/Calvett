import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface EntityState<T extends { id: string }> {
  items: T[];
  hydrated: boolean;
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  getById: (id: string) => T | undefined;
  hydrate: () => void;
  setHydrated: () => void;
}

export function createEntityStore<T extends { id: string }>(
  storageKey: string,
  seed: T[],
  version = 1,
) {
  const initializer: StateCreator<EntityState<T>> = (set, get) => ({
    items: [],
    hydrated: false,
    add: (item) => set((state) => ({ items: [...state.items, item] })),
    update: (id, patch) =>
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      })),
    remove: (id) =>
      set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    getById: (id) => get().items.find((i) => i.id === id),
    hydrate: () => {
      if (get().items.length === 0) {
        set({ items: seed });
      }
    },
    setHydrated: () => set({ hydrated: true }),
  });

  return create<EntityState<T>>()(
    persist(initializer, {
      name: storageKey,
      version,
      migrate: () => ({ items: seed }) as Partial<EntityState<T>>,
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return window.localStorage;
        // Fallback no-op storage for SSR
        const noop: Storage = {
          length: 0,
          clear: () => {},
          getItem: () => null,
          key: () => null,
          removeItem: () => {},
          setItem: () => {},
        };
        return noop;
      }),
      partialize: (state) => ({ items: state.items }) as Partial<EntityState<T>>,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }),
  );
}
