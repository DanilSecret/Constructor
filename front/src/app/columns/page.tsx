"use client";

import React, { useEffect, useState } from "react";
import { useColumnsStore } from "@/store/columns_store";
import { GetAllColumns } from "@/app/Api/Api";
import { Columns } from "@/app/models/models";
import { useUserStore } from "@/store/store";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { useFilterJoinStore } from "@/store/filter_joins_store";
import Image from "next/image";
import Link from "next/link";

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
                    setLocalSelected(selectedColumns);
                } else {
                    setError(result.message || "Ошибка при получении колонок");
                }
                setLoading(false);
            };
            GetColumns();
        }
    }, [selectedColumns, isAuth, hydrated, router, resetAll]);

    const handleToggle = (name: string) => {
        setLocalSelected((prev) =>
            prev.includes(name)
                ? prev.filter((n) => n !== name)
                : [...prev, name]
        );
    };

    const handleSave = () => {
        setSelectedColumns(localSelected);
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
        <div className="bg-[#F5F7FA] min-h-screen flex flex-col">
            <Header />
            <div className="flex justify-center items-start flex-1 mt-10 px-4">
                <div className="w-full max-w-2xl">
                    <div className="w-full relative mb-4 flex items-center">
                        <Link
                            href="/"
                            className="text-sm text-blue-600 hover:underline mr-6"
                        >
                            <Image
                                src="/Back.svg"
                                alt="Назад"
                                width={30}
                                height={30}
                            />
                        </Link>

                        <h1 className="text-3xl font-bold text-[#34495E] absolute left-1/2 transform -translate-x-1/2">
                            Выбор столбцов
                        </h1>

                        <div className="absolute right-0 group cursor-pointer">
                            <Image
                                src="/Question.svg"
                                alt="Вопрос"
                                width={30}
                                height={30}
                            />
                            <div
                                className="absolute top-full right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10"
                            >
                                Выберите нужные столбцы и нажмите &#34;Сохранить&#34;.<br />
                                Поиск работает по имени столбца.
                            </div>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Фильтр по названию столбца..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white w-full mb-4 px-4 py-2 border border-[#D5D8DC] rounded text-black"
                    />
                    <div className="border border-[#D5D8DC] rounded-lg shadow-md p-4 max-h-[50vh] overflow-y-auto bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredColumns.length > 0 ? (
                                filteredColumns.map((col) => (
                                    <label
                                        key={col.id}
                                        className="flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-100 transition cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={localSelected.includes(col.name)}
                                            onChange={() => handleToggle(col.name)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-[#34495E]">{col.name}</span>
                                    </label>
                                ))
                            ) : (
                                <div className="col-span-2 text-gray-500 text-sm">Нет совпадений</div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-[#3498DB] text-white font-semibold rounded hover:bg-[#2F89C5] transition"
                        >
                            Сохранить выбор
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
