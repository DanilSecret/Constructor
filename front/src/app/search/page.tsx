"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header";

import { Student } from "@/app/models/models";
import { searchStudents, deleteStudentByUUID } from "@/app/Api/Api";

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
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="max-w-screen-xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold text-[#34495E] mb-6">Поиск студентов</h1>

                <form onSubmit={handleSearch} className="mb-6 max-w-md flex space-x-2">
                    <input
                        type="text"
                        placeholder="Введите фамилию, имя, отчество или группу"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Поиск..." : "Найти"}
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow border border-[#D5D8DC]">
                        <thead>
                        <tr className="bg-gray-200 text-left text-sm">
                            <th className="px-4 py-2 border-b w-12 text-center">#</th>
                            <th className="px-4 py-2 border-b">Фамилия</th>
                            <th className="px-4 py-2 border-b">Имя</th>
                            <th className="px-4 py-2 border-b">Отчество</th>
                            <th className="px-4 py-2 border-b">Группа</th>
                            <th className="px-4 py-2 border-b">Действия</th>
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
                                    <td className="px-4 py-2 border-b space-x-2">
                                        <button
                                            onClick={() => router.push(`/search/edit/${student.uuid}`)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.uuid)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Удалить
                                        </button>
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
    );
}
