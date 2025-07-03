"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { useUserStore } from "@/store/store";

export default function AdminPanel() {
    const router = useRouter();

    const isAuth = useUserStore((state) => state.isAuth);
    const userData = useUserStore((state) => state.userData);
    const hydrated = useUserStore((state) => state.hydrated);

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuth) {
            router.push("/sign_in");
            return;
        }

        if (userData?.role !== "ADMIN" && userData?.role !== "DEANERY") {
            alert("Недостаточно прав для доступа к панели управления.");
            router.push("/");
        }
    }, [hydrated, isAuth, userData, router]);

    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-screen bg-white text-black">
                <p className="text-gray-500 text-lg">Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-black">
            <Header />
            <div className="max-w-screen-md mx-auto px-4 py-20">
                <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-10">
                    Панель управления
                </h1>
                <div className="flex flex-col gap-6 items-center">
                    <button
                        onClick={() => router.push("/control_panel/full_history")}
                        className="w-full sm:w-96 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded shadow transition"
                    >
                        Общая история
                    </button>
                    <button
                        onClick={() => router.push("/control_panel/users")}
                        className="w-full sm:w-96 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded shadow transition"
                    >
                        Управление пользователями
                    </button>
                </div>
            </div>
        </div>
    );
}
