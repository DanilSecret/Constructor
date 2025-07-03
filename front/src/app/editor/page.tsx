"use client";

import Link from "next/link";
import {useFilterJoinStore} from "@/store/filter_joins_store";
import Header from "@/app/components/Header";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useUserStore} from "@/store/store";
import Image from "next/image";


export default function ReportEditor() {
    const {
        filters,
        joins,
        removeFilter,
        removeJoin,
        resetAll,
        hydrated
    } = useFilterJoinStore();
    const isAuth = useUserStore((state) => state.isAuth);
    const router = useRouter();

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuth) {
            router.push('/sign_in/');
        }
    }, [isAuth, hydrated, router]);

    const handleConfirm = () => {
        router.push("/editor/download/");
    };

    return (
        <div className="h-screen flex flex-col">
            <Header/>
            <div className="flex flex-col h-screen bg-[#F5F7FA] text-black">
                <div className="max-w-screen-xl w-full mx-auto flex-1 flex flex-col">
                <div className="flex items-center justify-between px-4 py-2">
                    <Link
                        href="/columns"
                        className="text-sm text-blue-600 hover:underline mr-6"
                    >
                        <Image
                            src="/Back.svg"
                            alt="Назад"
                            width={30}
                            height={30}
                        />
                    </Link>

                    <h1 className="text-lg text-center flex-1 -ml-6 text-[#34495E]">
                        Редактор отчёта
                    </h1>

                    <div className="relative group">
                        <div className="text-blue-600 cursor-help text-sm underline ">
                            <Image
                                src="/Question.svg"
                                alt="Вопрос"
                                width={30}
                                height={30}
                            />
                        </div>
                        <div
                            className="absolute right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10">
                            Здесь вы можете добавлять фильтры и соединения для настройки отчёта.<br/>
                            Используйте фильтры, чтобы ограничить выборку данных.
                        </div>
                    </div>
                </div>


                <div className="flex flex-1 overflow-hidden p-4 gap-4">
                    <div className="flex-1 flex flex-col gap-4 overflow-auto">
                        <div className="max-w-[1030px] flex-[3] bg-white rounded shadow p-2 max-h-[400px] overflow-y-auto border border-[#D5D8DC]">
                        <h2 className="text-lg font-semibold mb-2 text-[#34495E]">Фильтры</h2>
                            {filters.length === 0 && <p className="text-gray-500">Фильтры отсутствуют</p>}
                            <ul className="space-y-3">
                                {filters.map((filter, idx) => (
                                    <li key={idx}
                                        className="border p-3 rounded bg-white relative border border-[#D5D8DC]">
                                        <div className="text-sm space-y-1">
                                            {Object.entries(filter).map(([key, value]) => (
                                                <div key={key}>
                                                    <span className="font-medium">{key}:</span> {value || (
                                                    <span className="text-gray-400 italic">пусто</span>
                                                )}
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            className="absolute top-1/2 right-1 flex gap-4 items-center transform -translate-y-1/2">
                                            <Link href={`/editor/edit_filter/${idx}`}>
                                                <div className="border border-[#D5D8DC] rounded p-1">
                                                    <Image src="/Edit.svg" alt="Редактирование" width={24} height={24} className="cursor-pointer"/>
                                                </div>
                                            </Link>
                                            <button onClick={() => removeFilter(idx)}>
                                                <div className="border border-[#D5D8DC] rounded p-1">
                                                    <Image src="/XLg.svg" alt="Удалить" width={24} height={24} className="cursor-pointer"/>
                                                </div>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div
                            className="max-w-[1030px] flex-[3] bg-white rounded shadow p-2 max-h-[400px] overflow-y-auto border border-[#D5D8DC]">
                            <h2 className="text-xl font-semibold mb-4 text-[#34495E]">Соединения</h2>
                            {joins.length === 0 && <p className="text-gray-500">Соединения отсутствуют</p>}
                            <ul className="space-y-3">
                                {joins.map((joinGroup, idx) => (
                                    <li key={idx} className="border p-3 rounded bg-white relative border border-[#D5D8DC]">
                                        <div className="text-sm flex gap-2">
                                            <div className="text-sm">
                                                {Object.values(joinGroup).filter(Boolean).join(" + ")}
                                            </div>

                                        </div>

                                        <div className="absolute top-1 right-1 flex gap-2">
                                            <button onClick={() => removeJoin(idx)}>
                                                <div className="border border-[#D5D8DC] rounded p-1 cursor-pointer">
                                                    <Image src="/XLg.svg" alt="Удалить" width={24} height={24}/>
                                                </div>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-49 flex flex-col gap-3 ">
                        <Link
                            href="/editor/add_filter"
                            className="text-center bg-[#3498DB] hover:bg-[#2F89C5] transition text-white py-2 px-4 rounded block"
                        >
                            Добавить фильтр
                        </Link>
                        <Link
                            href="/editor/add_join"
                            className="text-center bg-[#3498DB] hover:bg-[#2F89C5] transition text-white py-2 px-4 rounded block"
                        >
                            Добавить соединение
                        </Link>
                        <button
                            onClick={resetAll}
                            className="bg-[#3498DB] hover:bg-[#2F89C5] transition text-white py-2 px-4 rounded cursor-pointer"
                        >
                            Очистить всё
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="bg-[#3498DB] hover:bg-[#2F89C5] transition text-white py-2 px-4 rounded mt-auto cursor-pointer"
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
