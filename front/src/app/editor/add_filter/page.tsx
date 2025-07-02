"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useColumnsStore } from "@/store/columns_store";
import {useFilterJoinStore} from "@/store/filter_joins_store";
import {useUserStore} from "@/store/store";

export default function AddFilterPage() {
    const router = useRouter();

    const selectedColumns = useColumnsStore((state) => state.selectedColumns);
    const addFilter = useFilterJoinStore((state) => state.addFilter);
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);
    const hydratedFil = useFilterJoinStore((state) => state.hydrated);
    const hydratedCol = useColumnsStore((state) => state.hydrated);
    const [filtersInput, setFiltersInput] = useState<Record<string, string>>({});

    function handleInputChange(columnName: string, value: string) {
        setFiltersInput((prev) => ({ ...prev, [columnName]: value }));
    }

    function handleSave() {

        const newFilter: Record<string, string> = {};

        for (const [key, val] of Object.entries(filtersInput)) {
            if (val.trim() !== "") {
                newFilter[key] = val.trim();
            }
        }

        if (Object.keys(newFilter).length === 0) {
            alert("Введите хотя бы один фильтр");
            return;
        }

        addFilter(newFilter);

        router.push("/editor");
    }
    useEffect(() => {
        if (!hydrated || !hydratedFil || !hydratedCol) return;
        if (!isAuth) {
            router.push("/sign_in/");
        }
    },[hydrated, hydratedCol, hydratedFil, isAuth, router])

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded shadow-md">
            <h2 className="text-xl font-semibold mb-6">Добавить фильтры</h2>

            <div className="flex flex-col gap-4">
                {selectedColumns.map((col) => (
                    <div key={col.id} className="flex items-center gap-4">
                        <label className="w-48 font-medium">{col.name}</label>
                        <input
                            type="text"
                            value={filtersInput[col.name] || ""}
                            onChange={(e) => handleInputChange(col.name, e.target.value)}
                            placeholder={`Введите фильтр для ${col.name}`}
                            className="flex-grow border border-gray-300 rounded px-3 py-2 bg-white text-black"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.push("/editor")}
                    className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                >
                    Отмена
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
}
