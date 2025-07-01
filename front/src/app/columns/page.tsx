"use client";

import { useEffect, useState } from "react";
import { useColumnsStore } from "@/store/columns_store";
import { GetAllColumns } from "@/app/Api/Api";
import { Columns } from "@/app/models/models";
import { useUserStore } from "@/store/store";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import {useFilterJoinStore} from "@/store/filter_joins_store";


export default function ColumnsPage() {
    const { selectedColumns, setSelectedColumns } = useColumnsStore();
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);
    const [columns, setColumns] = useState<Columns[]>([]);
    const [localSelected, setLocalSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("");
    const router = useRouter();

    const resetAll = useFilterJoinStore((state) => state.resetAll);

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuth) {
            router.push("/sign_in/");
        } else {
            resetAll();

            const GetColumns = async () => {
                setLoading(true);
                const result = await GetAllColumns();
                if (result.success && result.data) {
                    setColumns(result.data);
                    const initiallySelected = selectedColumns.map((col) => col.id);
                    setLocalSelected(initiallySelected);
                } else {
                    setError(result.message || "Ошибка при получении колонок");
                }
                setLoading(false);
            };
            GetColumns();
        }
    }, [selectedColumns, isAuth, hydrated, router, resetAll]);


    const handleToggle = (id: string) => {
        setLocalSelected((prev) =>
            prev.includes(id)
                ? prev.filter((colId) => colId !== id)
                : [...prev, id]
        );
    };

    const handleSave = () => {
        const selected = columns.filter((col) =>
            localSelected.includes(col.id)
        );
        setSelectedColumns(selected);
        alert("Выбранные столбцы сохранены");
        router.push("/editor");
    };


    const filteredColumns = columns.filter((col) =>
        col.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (!hydrated || loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white text-black">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-white text-black">
                Ошибка: {error}
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <div className="flex justify-center items-start flex-1 mt-10 px-4">
                <div className="w-full max-w-2xl">
                    {/* Заголовок и подсказка */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-black">Выбор столбцов</h1>
                        <div className="relative group">
                            <div className="text-blue-600 cursor-pointer text-sm underline">?</div>
                            <div className="absolute right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                                Выберите нужные столбцы и нажмите &#34;Сохранить&#34;.<br />
                                Поиск работает по имени столбца.
                            </div>
                        </div>
                    </div>

                    {/* Поисковый фильтр */}
                    <input
                        type="text"
                        placeholder="Фильтр по названию столбца..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded text-black"
                    />

                    {/* Список чекбоксов */}
                    <div className="border rounded-lg shadow-md p-4 max-h-[50vh] overflow-y-auto bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredColumns.length > 0 ? (
                                filteredColumns.map((col) => (
                                    <label
                                        key={col.id}
                                        className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-100 transition cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={localSelected.includes(col.id)}
                                            onChange={() => handleToggle(col.id)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-black">{col.name}</span>
                                    </label>
                                ))
                            ) : (
                                <div className="col-span-2 text-gray-500 text-sm">Нет совпадений</div>
                            )}
                        </div>
                    </div>

                    {/* Кнопка сохранения */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                        >
                            Сохранить выбор
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
