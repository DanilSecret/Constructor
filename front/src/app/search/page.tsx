"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header";
import Image from "next/image";

import { Student } from "@/app/models/models";
import { searchStudents, deleteStudentByUUID } from "@/app/Api/Api";
import Link from "next/link";

export default function StudentSearchPage() {
    const router = useRouter();
    const isAuth = useUserStore((state) => state.isAuth);
    const hydrated = useUserStore((state) => state.hydrated);

    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuth) {
            router.push("/sign_in");
        }
    }, [hydrated, isAuth, router]);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setStudents([]);
            return;
        }

        setLoading(true);
        try {
            const res = await searchStudents( searchTerm.trim() );
            if (res.success) {
                setStudents(res.result);
            } else {
                alert("Ошибка при поиске студентов");
                setStudents([]);
            }
        } catch {
            alert("Ошибка сети или сервера");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(uuid: string) {
        if (!confirm("Удалить студента?")) return;

        try {
            const res = await deleteStudentByUUID(uuid);
            if (res.success) {
                setStudents((prev) => prev.filter((s) => s.uuid !== uuid));
            } else {
                alert("Ошибка при удалении студента");
            }
        } catch {
            alert("Ошибка сети или сервера при удалении");
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col text-black">
            <Header/>
            <div className="flex-1 flex justify-center items-stretch py-10 px-4">
                <div
                    className="w-full max-w-[900px] p-9 rounded-[10px] shadow-md bg-white border border-[#D5D8DC] flex flex-col flex-grow min-h-[calc(95vh-120px)] mx-auto"
                    style={{minWidth: '650px'}}
                >
                    <div className="w-full relative mb-6 flex items-center mt-3 mb-10">
                        <div className="flex-none">
                            <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center">
                                <Image src="/Back.svg" alt="Назад" width={30} height={30}/>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-[#34495E] absolute left-1/2 transform -translate-x-1/2">
                            Поиск студентов
                        </h1>
                        <div className="absolute right-0 group cursor-help">
                            <Image src="/Question.svg" alt="Вопрос" width={30} height={30}/>
                            <div
                                className="absolute top-full right-0 mt-1 w-64 p-2 bg-gray-100 border rounded shadow text-sm text-black hidden group-hover:block z-10"
                            >
                                Здесь можно найти студентов по фамилии, имени, отчеству или группе.
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-[900px] mx-auto flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                placeholder="Введите фамилию, имя, отчество или группу"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-grow max-w-[60%] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="text-white px-6 py-2 rounded bg-[#3498DB] hover:bg-[#2F89C5] disabled:opacity-50 min-w-[120px]"
                            >
                                {loading ? 'Поиск...' : 'Найти'}
                            </button>
                        </div>
                        <div className="flex justify-center w-full overflow-x-auto">
                            <table
                                className="bg-white rounded shadow border border-[#D5D8DC] w-full min-w-[650px]"
                            >
                                <thead>
                                <tr className="bg-gray-200 text-left text-sm">
                                    <th className="px-4 py-2 border-b w-12 text-center">#</th>
                                    <th className="px-4 py-2 border-b">Фамилия</th>
                                    <th className="px-4 py-2 border-b">Имя</th>
                                    <th className="px-4 py-2 border-b">Отчество</th>
                                    <th className="px-4 py-2 border-b">Группа</th>
                                    <th className="px-4 py-2 border-b w-48 text-center">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.uuid} className="text-sm hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                                            <td className="px-4 py-2 border-b">{student.surname}</td>
                                            <td className="px-4 py-2 border-b">{student.name}</td>
                                            <td className="px-4 py-2 border-b">{student.patronymic}</td>
                                            <td className="px-4 py-2 border-b">{student.group}</td>
                                            <td className="px-4 py-2 border-b ">
                                                <div className="flex items-center justify-center gap-x-2">
                                                    <button
                                                        onClick={() => router.push(`/search/edit/${student.uuid}`)}
                                                        className="px-2 py-1 text-white rounded shadow transition cursor-pointer"
                                                    >
                                                        <Image src="/Edit.svg" alt="Редактирование" width={24}
                                                               height={24}/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(student.uuid)}
                                                        className="px-2 py-1 text-white rounded shadow transition cursor-pointer"
                                                    >
                                                        <Image src="/XLg.svg" alt="Удалить" width={24} height={24}/>
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                            Студенты не найдены
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
