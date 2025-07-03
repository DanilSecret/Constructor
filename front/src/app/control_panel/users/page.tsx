"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header"; // если есть

import { User } from "@/app/models/models";
import {deleteUserByUUID, getAllUsers} from "@/app/Api/Api";

export default function UserManagementPage() {
    const router = useRouter();
    const isAuth = useUserStore((state) => state.isAuth);
    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuth) {
            router.push("/sign_in");
            return;
        }

        if (!["ADMIN", "DEANERY"].includes(userData?.role || "")) {
            alert("Недостаточно прав для доступа.");
            router.push("/");
            return;
        }

        loadUsers();
    }, [hydrated, isAuth, userData, router]);

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [search, users]);


    async function loadUsers() {
        const res = await getAllUsers();
        if (res.success) {
            setUsers(res.data);
            setFilteredUsers(res.data);
        } else {
            alert("Ошибка при загрузке пользователей");
        }
    }

    async function handleDelete(uuid: string) {
        if (!confirm("Удалить пользователя?")) return;
        const res = await deleteUserByUUID(uuid);
        if (res.success) {
            setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
        } else {
            alert("Ошибка при удалении");
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="max-w-screen-xl mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#34495E]">Управление пользователями</h1>
                    <button
                        onClick={() => router.push("/control_panel/users/create")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Добавить пользователя
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Поиск по почте и роли"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-6 w-full max-w-md px-4 py-2 border border-gray-300 rounded"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow border border-[#D5D8DC]">
                        <thead>
                        <tr className="bg-gray-200 text-left text-sm">
                            <th className="px-4 py-2 border-b w-12 text-center">#</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Роль</th>
                            <th className="px-4 py-2 border-b">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.uuid} className="text-sm hover:bg-gray-50">
                                <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{user.email}</td>
                                <td className="px-4 py-2 border-b">{user.role}</td>
                                <td className="px-4 py-2 border-b space-x-2">
                                    <button
                                        onClick={() => router.push(`/control_panel/users/edit/${user.uuid}`)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.uuid)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                                    Пользователи не найдены
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
