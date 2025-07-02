"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useColumnsStore } from "@/store/columns_store";
import { useFilterJoinStore } from "@/store/filter_joins_store";
import { useParams } from "next/navigation";
import {useUserStore} from "@/store/store";

export default function EditFilter() {
    const router = useRouter();
    const params = useParams();
    const filterId = params?.id ? Number(params.id) : null;
    const selectedColumns = useColumnsStore((state) => state.selectedColumns);
    const getFilterById = useFilterJoinStore((state) => state.getFilterById);
    const updateFilter = useFilterJoinStore((state) => state.updateFilter);
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);
    const hydratedFil = useFilterJoinStore((state) => state.hydrated);
    const hydratedCol = useColumnsStore((state) => state.hydrated);
    const [filtersInput, setFiltersInput] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!hydrated || !hydratedFil || !hydratedCol) return;
        if (!isAuth) {
            router.push("/sign_in/");
        } else {
            if (filterId === null) return;

            const filter = getFilterById(filterId);
            if (filter) {
                const initialInputs: Record<string, string> = {};
                Object.entries(filter).forEach(([key, value]) => {
                    initialInputs[key] = String(value);
                });
                setFiltersInput(initialInputs);
            }
        }
        
    }, [filterId, getFilterById, hydrated, hydratedCol, hydratedFil, isAuth, router]);

    function handleInputChange(columnName: string, value: string) {
        setFiltersInput((prev) => ({ ...prev, [columnName]: value }));
    }

    function handleSave() {
        if (filterId === null) {
            alert("Ошибка: не указан ID фильтра");
            return;
        }

        const newFilter: Record<string, string | number> = {};
        for (const [key, val] of Object.entries(filtersInput)) {
            if (val.trim() !== "") {
                const num = Number(val);
                newFilter[key] = isNaN(num) ? val.trim() : num;
            }
        }

        if (Object.keys(newFilter).length === 0) {
            alert("Введите хотя бы один фильтр");
            return;
        }

        updateFilter(filterId, newFilter);

        router.push("/editor");
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded shadow-md">
            <h2 className="text-xl font-semibold mb-6">Редактировать фильтр</h2>

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
