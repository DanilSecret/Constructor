'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import { useUserStore } from '@/store/store';
import { useRouter } from "next/navigation";
import { ReportEntry } from "@/app/models/models";
import { ReportsFullHistory } from "@/app/Api/Api";
import {useColumnsStore} from "@/store/columns_store";
import {useFilterJoinStore} from "@/store/filter_joins_store";

export default function ReportFullHistory() {
    const [reports, setReports] = useState<ReportEntry[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const userUUID = useUserStore((state) => state.userData?.uuid);
    const isAuth = useUserStore((state) => state.isAuth);
    const { setSelectedColumns } = useColumnsStore();
    const { setFilters, setJoins } = useFilterJoinStore();

    const hydrated = useUserStore((state) => state.hydrated);
    const router = useRouter();

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuth) {
            router.push("/sign_in/");
            return;
        }

        const loadReports = async () => {
            const result = await ReportsFullHistory();
            console.log(result)

            if (result.success) {
                console.log(result.data)
                setReports(result.data);
            } else {
                setMessage(result.message || "Ошибка при получении истории.");
            }
        };

        loadReports();
    }, [hydrated, isAuth, router, userUUID]);

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="max-w-screen-xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold text-[#34495E] mb-6">История отчётов</h1>

                {message && (
                    <div className="text-red-600 text-sm mb-4">{message}</div>
                )}

                {reports.length === 0 && !message && (
                    <div className="text-gray-500">История пуста</div>
                )}

                <ul className="space-y-4">
                    {reports.slice().reverse().map((report, idx) => (
                        <li
                            key={idx}
                            className="bg-white rounded shadow border border-[#D5D8DC] p-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <div className="text-sm text-gray-600">Автор:</div>
                                    <div className="font-medium">{report.email}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Дата:</div>
                                    <div className="font-medium">
                                        {new Date(report.date).toLocaleString('ru-RU')}
                                    </div>
                                </div>
                            </div>


                            <button
                                onClick={() => setExpanded(expanded === idx ? null : idx)}
                                className="text-blue-600 text-sm underline"
                            >
                                {expanded === idx ? 'Скрыть столбцы, фильтры и соединения' : 'Показать столбцы, фильтры и соединения'}
                            </button>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedColumns(report.col);
                                        setFilters(report.filter);
                                        setJoins(report.joins);
                                        router.push('/editor');
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                                >
                                    Открыть в редакторе
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedColumns(report.col);
                                        setFilters(report.filter);
                                        setJoins(report.joins);
                                        router.push('/editor/download');
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded text-sm"
                                >
                                    Скачать
                                </button>
                            </div>


                            {expanded === idx && (
                                <div className="mt-3 space-y-3 text-sm text-[#34495E]">
                                    <div className="mb-2">
                                        <div className="text-sm text-gray-600">Выбранные колонки:</div>
                                        <ul className="list-disc pl-5 text-sm text-[#34495E] mt-1">
                                            {report.col.map((col, i) => (
                                                <li key={i}>{col}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">Фильтры:</div>
                                        {report.filter.length === 0 ? (
                                            <div className="text-gray-500">Нет фильтров</div>
                                        ) : (
                                            <ul className="list-disc pl-5">
                                                {report.filter.map((filter, fi) => (
                                                    <li key={fi}>
                                                        {Object.entries(filter).map(([k, v]) => (
                                                            <div key={k}>
                                                                <span className="font-medium">{k}:</span> {v}
                                                            </div>
                                                        ))}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div>
                                        <div className="font-semibold mb-1">Соединения:</div>
                                        {report.joins.length === 0 ? (
                                            <div className="text-gray-500">Нет соединений</div>
                                        ) : (
                                            <ul className="list-disc pl-5">
                                                {report.joins.map((joinGroup, ji) => (
                                                    <li key={ji}>{joinGroup.join(' + ')}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
