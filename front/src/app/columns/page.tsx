"use client";

import { useEffect, useState } from "react";
import { useColumnsStore } from "@/store/columns_store";
import {GetAllColumns} from "@/app/Api/Api";
import {Columns} from "@/app/models/models";
import {useUserStore} from "@/store/store";
import {useRouter} from "next/navigation";


export default function ColumnsPage() {
    const { selectedColumns, setSelectedColumns } = useColumnsStore();
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);
    const [columns, setColumns] = useState<Columns[]>([]);
    const [localSelected, setLocalSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()


    useEffect(() => {
        if (!hydrated) return;
        if (!isAuth) {
            router.push('/sign_in/');
        } else {
            const GetColumns = async () => {
                setLoading(true)
                const result = await GetAllColumns();
                if (result.success && result.data) {
                    setColumns(result.data)
                    const initiallySelected = selectedColumns.map((col) => col.id);
                    setLocalSelected(initiallySelected);
                } else {
                    setError(result.message || "Ошибка при получении колонок");
                }
                setLoading(false)
            }
            GetColumns()
        }
    }, [selectedColumns, isAuth, hydrated, router]);

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
    };
    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    if (loading) return <p className="p-4 text-lg">Загрузка колонок...</p>;
    if (error)
        return (
            <div className="p-4 text-red-600 font-semibold">
                Ошибка: {error}
            </div>
        );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-black">Выбор столбцов</h1>

            <div className="border rounded-lg shadow-md p-4 max-h-[70vh] overflow-y-auto bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {columns.map((col) => (
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
                    ))}
                </div>
            </div>

            <button
                onClick={handleSave}
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
                Сохранить выбор
            </button>
        </div>
    );
}
