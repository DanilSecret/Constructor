"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import {logout} from "@/app/Api/Api";

export default function Header() {
    const isAuth = useUserStore((state) => state.isAuth);
    const userData = useUserStore((state) => state.userData);
    const { setUserData, setIsAuth } = useUserStore();

    const destroyCookie = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        } finally {
            setUserData(null);
            setIsAuth(false);
            window.location.href = '/sign_in/';
        }
    };

    return (
        <header className="bg-[#2C3E50] text-white w-full px-4 py-3 shadow-md">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/" className="hover:underline">Главная</Link>
                        <Link href="/upload" className="hover:underline">Загрузить файл</Link>
                        <Link href="/columns" className="hover:underline">Создать отчет</Link>
                        <Link href="/history" className="hover:underline">История отчетов</Link>
                        <Link href="/search" className="hover:underline">Поиск студентов</Link>
                        {(userData?.role === "ADMIN" || userData?.role === "DEANERY") && (
                            <Link href="/control_panel" className="hover:underline">Панель управления</Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    {isAuth ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={destroyCookie}
                                className="hover:underline flex flex-row gap-2 cursor-pointer"
                            >
                                Выйти
                                <Image src="/exit.svg" alt="exit" width={20} height={20}/>
                            </button>
                        </div>
                    ) : (
                        <Link href="/sign_in" className="hover:underline">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
