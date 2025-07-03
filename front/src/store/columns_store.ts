import { create } from "zustand";
import { persist } from "zustand/middleware";


type ColumnsState = {
    selectedColumns: string[];
    setSelectedColumns: (columns: string[]) => void;
    hydrated: boolean;
    setHydrated: () => void;
};

export const useColumnsStore = create<ColumnsState>()(
    persist(
        (set) => ({
            hydrated: false,
            selectedColumns: [],
            setSelectedColumns: (columns) => set({ selectedColumns: columns }),
            setHydrated: () => set({ hydrated: true }),
        }),
        {
            name: "columns-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated?.();
            },
        }
    )
);

