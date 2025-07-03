"use client";

import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useColumnsStore } from "@/store/columns_store";
import { useFilterJoinStore } from "@/store/filter_joins_store";
import {useUserStore} from "@/store/store";
import Image from "next/image";

export default function AddJoinPage() {
    const router = useRouter();
    const selectedColumns = useColumnsStore((state) => state.selectedColumns);
    const addJoin = useFilterJoinStore((state) => state.addJoin);
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);
    const hydratedFil = useFilterJoinStore((state) => state.hydrated);
    const hydratedCol = useColumnsStore((state) => state.hydrated);

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
    useEffect(() => {
        if (!hydrated || !hydratedFil || !hydratedCol) return;
        if (!isAuth) {
            router.push("/sign_in/");
        }
    },[hydrated, hydratedCol, hydratedFil, isAuth, router])

    return (
        <div className="min-h-screen bg-[#f6f8fb] flex flex-col items-center justify-center">
            <div className="bg-white rounded-lg shadow p-5 w-full max-w-3xl my-20 border border-[#D5D8DC] text-black">
                <div className="w-full relative flex items-center mb-10">
                <h2 className="text-xl text-[#2f3a4c] absolute left-1/2 transform -translate-x-1/2">Добавить соединение</h2>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 group cursor-pointer">
                    <Image
                        src="/Question.svg"
                        alt="Вопрос"
                        width={30}
                        height={30}
                    />
                    <div
                        className="absolute top-full right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                        Отметьте два и более столбца, которые должны быть объединены в одно условие фильтрации.
                    </div>
                </div>
                </div>
                <div className="flex flex-col gap-4">
                    {selectedColumns.map((col) => (
                        <label key={col} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={checkedColumns[col] ?? false}
                                onChange={() => handleCheckboxChange(col)}
                                className="w-5 h-5"
                            />

                            <span>{col}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-4">
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
                        className="px-4 py-2 bg-[#3498DB] hover:bg-[#2F89C5] transition text-white rounded"
                    >
                        Сохранить соединение
                    </button>
                </div>
            </div>
        </div>
    );
}
