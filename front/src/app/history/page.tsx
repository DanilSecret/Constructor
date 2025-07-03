'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import { useUserStore } from '@/store/store';
import { useRouter } from "next/navigation";
import { ReportEntry } from "@/app/models/models";
import { ReportsHistory } from "@/app/Api/Api";
import {useColumnsStore} from "@/store/columns_store";
import {useFilterJoinStore} from "@/store/filter_joins_store";
import Image from "next/image";
import Link from "next/link";

export default function ReportHistory() {
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
            const result = await ReportsHistory(userUUID);

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
        <div className="min-h-screen bg-[#F5F7FA] text-black flex flex-col items-center justify-center">
            <Header />
            <div className="bg-white rounded-lg shadow p-2 w-full max-w-4xl my-15 border border-[#D5D8DC]">
                <div className="max-w-screen-xl mx-auto py-3 px-4">
                    <div className="w-full relative mb-4 flex items-center mt-3 mb-10">
                        <Link
                            href="/"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            <Image
                                src="/Back.svg"
                                alt="Назад"
                                width={30}
                                height={30}
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-[#34495E] absolute left-1/2 transform -translate-x-1/2">История отчетов</h1>
                        <div className="absolute right-0 group cursor-help">
                            <Image
                                src="/Question.svg"
                                alt="Вопрос"
                                width={30}
                                height={30}
                            />
                            <div className="absolute top-full right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                                &#34;Открыть в редакторе&#34; — переход на страницу редактирования отчёта с выбранными в нем столбцами, фильтрами и соединениями.<br/>
                                &#34;Скачать&#34; — открытие страницы для скачивания выбранного отчёта.
                            </div>
                        </div>
                    </div>


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
                                <div className="flex justify-end space-x-2 mt-4 ">
                                    <button
                                        onClick={() => {
                                            setSelectedColumns(report.col);
                                            setFilters(report.filter);
                                            setJoins(report.joins);
                                            router.push('/editor');
                                        }}
                                        className="bg-[#3498DB] hover:bg-[#2F89C5] transition text-white px-4 py-1 rounded text-sm flex items-center cursor-pointer"
                                    >
                                        Открыть в редакторе
                                        <Image
                                            src="/EditReport.svg"
                                            alt=""
                                            width={25}
                                            height={25}
                                            className="ml-2"
                                        />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedColumns(report.col);
                                            setFilters(report.filter);
                                            setJoins(report.joins);
                                            router.push('/editor/download');
                                        }}
                                        className="bg-[#3498DB] hover:bg-[#2F89C5] transition text-white px-4 py-1 rounded text-sm flex items-center cursor-pointer"
                                    >
                                        Скачать
                                        <Image
                                            src="/DownloadReport.svg"
                                            alt=""
                                            width={22}
                                            height={22}
                                            className="ml-2"
                                        />
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
        </div>
    );
}
