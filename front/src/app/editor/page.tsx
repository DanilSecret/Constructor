"use client";

import Link from "next/link";
import {useFilterJoinStore} from "@/store/filter_joins_store";
import Header from "@/app/components/Header";
import {useRouter} from "next/navigation";


export default function ReportEditor() {
    const {
        filters,
        joins,
        removeFilter,
        removeJoin,
        resetAll,
    } = useFilterJoinStore();
    const router = useRouter();

    const handleConfirm = () => {
        router.push("/editor/download/");
    };

    return (
        <div>
            <Header/>
            <div className="flex flex-col h-screen bg-gray-50 text-black">
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Кнопка "назад" */}
                    <a
                        href="/columns"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Назад
                    </a>

                    {/* Заголовок */}
                    <h1 className="text-lg text-center flex-1 -ml-6">
                        Редактор отчёта
                    </h1>

                    <div className="relative group">
                        <div className="text-blue-600 cursor-pointer text-sm underline">?</div>
                        <div
                            className="absolute right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                            Здесь вы можете добавлять фильтры и соединения для настройки отчёта.<br/>
                            Используйте фильтры, чтобы ограничить выборку данных.
                        </div>
                    </div>


                </div>

                {/* Основное содержимое */}
                <div className="flex flex-1 overflow-hidden p-4 gap-4">
                    {/* Левая часть */}
                    <div className="flex-1 flex flex-col gap-4 overflow-auto">
                        {/* Блок фильтров */}
                        <div className="flex-[3] bg-white rounded shadow p-4 overflow-auto">
                            <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
                            {filters.length === 0 && <p className="text-gray-500">Фильтры отсутствуют</p>}
                            <ul className="space-y-3">
                                {filters.map((filter, idx) => (
                                    <li key={idx} className="border p-3 rounded bg-gray-100 relative">
                                        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(filter, null, 2)}</pre>
                                        <div className="absolute top-1 right-1 flex gap-2">
                                            <Link href={`/editor/edit_filter/${idx}`} className="text-blue-600 hover:text-blue-800 font-bold select-none">
                                                ✎
                                            </Link>
                                            <button
                                                onClick={() => removeFilter(idx)}
                                                className="text-red-600 hover:text-red-800 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Блок соединений */}
                        <div className="flex-[2] bg-white rounded shadow p-4 overflow-auto">
                            <h2 className="text-xl font-semibold mb-4">Соединения</h2>
                            {joins.length === 0 && <p className="text-gray-500">Соединения отсутствуют</p>}
                            <ul className="space-y-3">
                                {joins.map((joinGroup, idx) => (
                                    <li key={idx} className="border p-3 rounded bg-gray-100 relative">
                                        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(joinGroup, null, 2)}</pre>
                                        <div className="absolute top-1 right-1 flex gap-2">
                                            <button
                                                onClick={() => removeJoin(idx)}
                                                className="text-red-600 hover:text-red-800 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Правая панель управления */}
                    <div className="w-52 flex flex-col gap-3">
                        <Link
                            href="/editor/add_filter"
                            className="text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded block"
                        >
                            Добавить фильтр
                        </Link>
                        <Link
                            href="/editor/add_join"
                            className="text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded block"
                        >
                            Добавить соединение
                        </Link>
                        <button
                            onClick={resetAll}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                        >
                            Очистить всё
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mt-auto"
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
