"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useColumnsStore } from "@/store/columns_store";
import { useFilterJoinStore } from "@/store/filter_joins_store";
import { useParams } from "next/navigation";
import {useUserStore} from "@/store/store";
import Image from "next/image";

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
        <div className="min-h-screen bg-[#f6f8fb] flex flex-col items-center justify-center">
            <div className="bg-white rounded-lg shadow p-5 w-full max-w-4xl my-20 border border-[#D5D8DC]">
                <div className="w-full relative flex items-center mb-10">
                    <h2 className="text-xl text-[#2f3a4c] absolute left-1/2 transform -translate-x-1/2">
                        Редактировать фильтр
                    </h2>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 group cursor-pointer">
                        <Image
                            src="/Question.svg"
                            alt="Вопрос"
                            width={30}
                            height={30}
                        />
                        <div
                            className="absolute top-full right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                            Измените значения фильтра, чтобы обновить параметры выборки данных в отчёте.
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 text-black ">
                    {selectedColumns.map((col) => (
                        <div key={col} className="flex items-center gap-4">
                            <label className="w-60 font-medium">{col}</label>
                            <input
                                type="text"
                                value={filtersInput[col] || ""}
                                onChange={(e) => handleInputChange(col, e.target.value)}
                                placeholder={`Введите фильтр для ${col}`}
                                className="flex-grow border border-gray-300 rounded px-3 py-2 bg-white text-black"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.push("/editor")}
                        className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 text-black"
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#3498DB] hover:bg-[#2F89C5] transition text-white rounded"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
}
