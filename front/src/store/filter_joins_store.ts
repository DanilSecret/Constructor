import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Filter = Record<string, string | number>;
type JoinGroup = string[][];

interface FilterJoinState {
    filters: Filter[];
    joins: JoinGroup;
    hydrated: boolean;
    addFilter: (filter: Filter) => void;
    updateFilter: (index: number, filter: Filter) => void;
    removeFilter: (index: number) => void;

    addJoin: (joinGroup: string[]) => void;
    updateJoin: (index: number, joinGroup: string[]) => void;
    removeJoin: (index: number) => void;

    resetAll: () => void;
    setHydrated: () => void;
    getFilterById: (index: number) => Filter | undefined;


}

export const useFilterJoinStore = create<FilterJoinState>()(
    persist(
        (set, get) => ({
            filters: [],
            joins: [],
            hydrated: false,

            addFilter: (filter: Filter) =>
                set((state) => ({ filters: [...state.filters, filter] })),

            updateFilter: (index, filter) =>
                set((state) => {
                    const updated = [...state.filters];
                    updated[index] = filter;
                    return { filters: updated };
                }),

            removeFilter: (index) =>
                set((state) => {
                    const updated = [...state.filters];
                    updated.splice(index, 1);
                    return { filters: updated };
                }),

            addJoin: (joinGroup) =>
                set((state) => ({ joins: [...state.joins, joinGroup] })),

            updateJoin: (index, joinGroup) =>
                set((state) => {
                    const updated = [...state.joins];
                    updated[index] = joinGroup;
                    return { joins: updated };
                }),

            removeJoin: (index) =>
                set((state) => {
                    const updated = [...state.joins];
                    updated.splice(index, 1);
                    return { joins: updated };
                }),

            resetAll: () => set({ filters: [], joins: [] }),

            getFilterById: (index: number) => {
                const filters = get().filters;
                if (index < 0 || index >= filters.length) return undefined;
                return filters[index];
            },

            setHydrated: () => set({ hydrated: true }),

        }),
        {
            name: "filter-join-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated?.();
            },
        }
    )
);
