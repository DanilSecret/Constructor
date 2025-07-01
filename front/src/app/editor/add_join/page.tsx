"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useColumnsStore } from "@/store/columns_store";
import { useFilterJoinStore } from "@/store/filter_joins_store";

export default function AddJoinPage() {
    const router = useRouter();
    const selectedColumns = useColumnsStore((state) => state.selectedColumns);
    const addJoin = useFilterJoinStore((state) => state.addJoin);

    const [checkedColumns, setCheckedColumns] = useState<Record<string, boolean>>({});

    function handleCheckboxChange(columnName: string) {
        setCheckedColumns((prev) => ({
            ...prev,
            [columnName]: !prev[columnName],
        }));
    }

    function handleSave() {
        const selected = Object.entries(checkedColumns)
            .filter(([, isChecked]) => isChecked)
            .map(([colName]) => colName);

        if (selected.length < 2) {
            alert("Выберите хотя бы два столбца для соединения.");
            return;
        }

        // Сохраняем новое соединение
        addJoin(selected);
        router.push("/editor");
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white text-black rounded shadow-md">
            <h2 className="text-xl font-semibold mb-6">Добавить соединение</h2>

            <div className="flex flex-col gap-4">
                {selectedColumns.map((col) => (
                    <label key={col.id} className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={checkedColumns[col.name] ?? false}
                            onChange={() => handleCheckboxChange(col.name)}
                            className="w-5 h-5"
                        />

                        <span>{col.name}</span>
                    </label>
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
                    Сохранить соединение
                </button>
            </div>
        </div>
    );
}
