"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Header from "@/app/components/Header"; // если есть

import { User } from "@/app/models/models";
import {deleteUserByUUID, getAllUsers} from "@/app/Api/Api";
import Image from "next/image";
import Link from "next/link";

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
            translateRole(user.role).toLowerCase().includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [search, users]);

    function translateRole(role: string): string {
        switch (role) {
            case "ADMIN":
                return "Администратор";
            case "DEANERY":
                return "Декан";
            case "METHODIST":
                return "Методист";
            default:
                return role;
        }
    }


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
        <div className="min-h-screen bg-[#F5F7FA] flex flex-col text-black">
            <Header/>
            <div className="flex-1 flex justify-center items-stretch py-10">
                <div className="max-w-screen-xl w-full mx-auto px-6">
                    <div
                        className="w-full p-9 rounded-[10px] shadow-md bg-white border border-[#D5D8DC] flex flex-col flex-grow min-h-[calc(95vh-120px)] "
                        style={{minWidth: '650px'}}
                    >
                        <div className="flex items-center mb-6 justify-between">
                            <div className="flex-none"><Link href="/control_panel"
                                                             className="text-sm text-blue-600 hover:underlinee">
                                <Image src="/Back.svg" alt="Назад" width={30} height={30}/></Link>
                            </div>
                            <div className="flex-initial"><h1 className="text-xl font-bold text-[#34495E]">Управление
                                пользователями</h1></div>
                            <div></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center w-full max-w-3xl mb-3 mt-2 px-4">
                                <div className="flex-grow mr-2">
                                    <input
                                        type="text"
                                        placeholder="Поиск по почте и роли"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-4 py-2 border border-[#D5D8DC] rounded focus:outline-none focus:ring-2 focus:ring-[#3498DB] -ml-8"
                                    />
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => router.push("/control_panel/users/create")}
                                        className="bg-[#3498DB] hover:bg-[#2F89C5] text-white px-4 py-2 rounded shadow transition cursor-pointer min-w-[160px] -mr-8"
                                    >
                                        Добавить пользователя
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center w-full">
                                <table className="bg-white rounded border border-[#D5D8DC] w-200">
                                    <thead>
                                    <tr className="bg-[#EAF4FB] text-left text-sm text-[#34495E]">
                                        <th className="px-4 py-2 border-b w-12 text-center">#</th>
                                        <th className="px-4 py-2 border-b">Email</th>
                                        <th className="px-4 py-2 border-b">Роль</th>
                                        <th className="px-4 py-2 border-b w-40 text-center">Действия</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={user.uuid} className="text-sm hover:bg-[#F0F5FA]">
                                                <td className="px-4 py-2 border-b text-center">{index + 1}</td>
                                                <td className="px-4 py-2 border-b">{user.email}</td>
                                                <td className="px-4 py-2 border-b">{translateRole(user.role)}</td>
                                                <td className="px-4 py-2 border-b w-60">
                                                    <div className="flex justify-center gap-x-2">
                                                        <button
                                                            onClick={() => router.push(`/control_panel/users/edit/${user.uuid}`)}
                                                            className="px-2 py-1 text-white rounded shadow transition cursor-pointer"
                                                        >
                                                            <Image src="/Edit.svg" alt="Редактирование" width={24}
                                                                   height={24}/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.uuid)}
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
                                            <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                                                Пользователи не найдены
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
        </div>
    );
}
